import React from 'react';
import {withExport} from './withExport';
import {asyncWait} from '../helpers/asyncWait';
import {GPX2JSON} from './gpx2json'
import {groupBy, each} from 'lodash';

export function withExportProcess(C) {
	@withExport
	class withExportProcess extends React.PureComponent {
		state = {
			screenshots: [],
			running: false
		}

		doGenerateMap = async (currentConfig, i) => {
			let {doUpdateMap, doExportMap, leaflet} = this.props;
			let container = leaflet.layerContainer.getContainer();

			await doUpdateMap(currentConfig);
			await asyncWait(1000);
			let url = await doExportMap(currentConfig.imageName, container) 

			return {
				key: parseInt(Math.random() *  1000000000000),
				url,
				config: currentConfig
			}
		}

		doConvertFile2GPX = (file, offset)=>{
			this.setState({
				running: true
			})
			return GPX2JSON(file, offset)
		}

		doRegenerateMap = async (i) => {
			let {config} = this.state.screenshots[i];

			let data = await this.doGenerateMap(config, i);
			
			var s = [...this.state.screenshots];

			s[i] = {
				...s[i],
				...data
			}	
			
			await new Promise((resolve)=>{
				this.setState({
					screenshots: s
				}, resolve)
			})
		}

		doExportStructure = async (configs) =>{
			let {doExportFile} = this.props;

			var screenshotsByTrace = groupBy(configs, ({segment, trace})=>{
				return trace.name + " - " + (segment.name || segment.index);
			})
			console.log(screenshotsByTrace);

			var pages = [];
			each(screenshotsByTrace, (screenshots)=>{
				each(screenshots, (screenshot)=>{
					var title = (screenshot.segment.name || screenshot.trace.name) + " | " + screenshot.startTooltip + " - " + screenshot.endTooltip;
					pages.push({
						title,
						distCumEnd: screenshot.distCumEnd,
						distCumStart: screenshot.distCumStart,
						start: screenshot.startTooltip,
						end: screenshot.endTooltip,
						trace: (screenshot.segment.name || screenshot.trace.name),
						imageName: screenshot.imageName
					})
				})
			})

			await doExportFile("pages.json", JSON.stringify(pages));
			return pages;
		}

		doExportAllMaps = async (configs) => {
			var s = [];
			
			await new Promise((resolve)=>{
				this.setState({
					configs
				}, resolve)
			})

			for(var i = 0; i < configs.length; i++) {
				let currentConfig = configs[i];
				let data = await this.doGenerateMap(currentConfig, i);
				s.push({
					...data,
					i
				})
				await new Promise((resolve)=>{
					this.setState({
						screenshots: [...s]
					}, resolve)
				})
			}

			this.setState({
				running: false,
				done: true
			})
		}

		render() {
			let {running, done, screenshots, configs} = this.state;
			var progress = configs && screenshots ? parseInt(100 *  screenshots.length / configs.length) : null;


			window.leaflet= this.props.leaflet;

			return <C
				{...this.props}
				running={running}
				done={done}
				progress={progress}
				screenshots={screenshots}
				doConvertFile2GPX={this.doConvertFile2GPX}
				doExportAllMaps={this.doExportAllMaps}
				doRegenerateMap={this.doRegenerateMap}
				doExportStructure={this.doExportStructure}
			/>
		}
	}

	return withExportProcess;
}