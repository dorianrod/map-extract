import React from 'react';
import './style.less';

const zoomSize = [ //https://wiki.openstreetmap.org/wiki/Zoom_levels
	"1:500 Mio",
	"1:250 Mio",
	"1:150 Mio",
	"1:70 Mio",
	"1:35 Mio",
	"1:15 Mio",
	"1:10 Mio",
	"1:4 Mio",
	"1:2 Mio",
	"1:1 Mio",
	"1:500 000",
	"1:250 000",
	"1:150 000",
	"1:70 000",
	"1:35 000",
	"1:15 000",
	"1:8 000",
	"1:4 000",
	"1:2 000",
	"1:1 000",
	"1:500",
	"1:250"
]

export class Parameters extends React.PureComponent {
	onChange = (field, value)=>{
		if(isNaN(value)) return;
		this.props.onChange({[field]: value});
	}

	render() {
		return <div id="parameters">
			<div>
				<label>Map width</label>
				<input type="number" min={400} max={2000} onChange={(e)=>this.onChange("width", parseInt(e.target.value))} defaultValue={this.props.width} ></input>
			</div>
			<div>
				<label>Map height</label>
				<input type="number" min={400} max={2000} onChange={(e)=>this.onChange("height", parseInt(e.target.value))} defaultValue={this.props.height} ></input>
			</div>
			<div>
				<label>Scale (zoom) <b>({zoomSize[this.props.zoom]})</b></label>
				<input type="number" min={0} max={18} onChange={(e)=>this.onChange("zoom", parseInt(e.target.value))} defaultValue={this.props.zoom} ></input>
			</div>
			<div>
				<label>Greyscale and increase constrast</label>
				<input type="checkbox" onChange={(e)=>{
					this.onChange("greyscale", e.target.checked)
				}} defaultChecked={this.props.greyscale} ></input>
			</div>
		</div>;
  }
}
