import React from 'react';
import './screenshots.less';

export class ScreenShots extends React.PureComponent {
    render() {
        let {screenshots, ...props} = this.props;

        return screenshots instanceof Array && screenshots.length ? <>
            <h2>Exported maps</h2>
            <ul className="screenshots">
                {
                    [...screenshots].reverse().map((data)=>{
                        return <ScreenShot {...props} {...data} />
                    })
                }
            </ul> 
        </>: null
        
    }
}

class ScreenShot extends React.PureComponent {
    regenerate = ()=>{
        let {doRegenerateMap, i} = this.props;
        doRegenerateMap(i);
    }
    render() {
        let {running, url, i, config: {startTooltip, endTooltip}} = this.props;
        return <li>
            <div>
                <img src={url} />
            </div>
            <div>
                <div>
                    <h2>#{i}</h2>
                    <br/>
                    Start: {startTooltip}
                    <br/>
                    End: {endTooltip}
                </div>
                <button className={running ? "disabled": null} onClick={this.regenerate}>Regenerate</button>
            </div>
        </li>
    }
}
