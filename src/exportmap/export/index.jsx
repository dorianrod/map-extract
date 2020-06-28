import React from 'react';
import ReactDOM from 'react-dom';
import {withExportProcess} from './withExportProcess';
import {withConfig} from './withConfig';
import {cx} from '../helpers/cx';
import {withLeaflet} from 'react-leaflet'
import {DropArea} from './dropzone'
import {ScreenShots} from './screenshots'

import './style.less';

@withLeaflet
@withExportProcess
@withConfig
export class ExportArea extends React.PureComponent {
    state = {
        config: []
    }

    onGpxDownload = (traces)=>{
        let {getConfigByTracks, doExportAllMaps, doExportStructure} = this.props;
        let configs = getConfigByTracks(traces);
        doExportStructure(configs);
        doExportAllMaps(configs);
    }

    render() {
        let {containerId, screenshots, progress, running, done, doConvertFile2GPX, doRegenerateMap} = this.props;
        return ReactDOM.createPortal(
			<>
                <Progress progress={progress} running={running} />
                <DropArea onGpxDownload={this.onGpxDownload} doConvertFile2GPX={doConvertFile2GPX} done={done}  running={running}/>
                <ScreenShots screenshots={screenshots} running={running} doRegenerateMap={doRegenerateMap} />
            </>,
			document.getElementById(containerId),
		);
    }
}

const Progress = (p)=>{
    let perc = (p.progress ||0) + "%";
    
    return p.running ? <div style={{"--progress": perc}} className="progress">
        {perc}
    </div> : null;
}