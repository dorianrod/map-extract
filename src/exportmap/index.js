import React from 'react';
import ReactDOM from 'react-dom';
import {Map} from './map';
import $ from 'jquery';
import {ExportArea} from './export';
import {Parameters} from './parameters';
import './style.less';

window.$ = $;
window.jQuery = $;

class App extends React.PureComponent {
	state = {
		parameters: {
			zoom: 14,
			width: 550,
			height: 850,
			greyscale: 1
		}
	}

	setRefMap = (map)=>{
		this.setState(map ? map.contextValue : {
			map: null,
			layerContainer: null
		})
	}

	doChangeParameter = (data)=>{
		this.setState({
			parameters: {
				...this.state.parameters,
				...data
			}
		})
	}

    render() {//style={{...this.state.parameters, zoom: "unset"}}
        return <div className="panels">
			<div className="left" >
				<Map 
					setRefMap={this.setRefMap} 
					{...this.state.parameters}
				>
					<ExportArea 
						containerId="controls" 
						{...this.state.parameters}
					/>
				</Map>
			</div>
			<div className="right">
				<div>
					<h2>Parameters</h2>
					<Parameters 
						onChange={this.doChangeParameter} 
						{...this.state.parameters}
					/>
				</div>
				<div id="controls">
					
				</div>
			</div>
        </div>
    }
}

ReactDOM.render(<App />, document.getElementById('app'))