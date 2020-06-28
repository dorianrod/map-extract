import React from 'react';
import { Map as LeafletMap, Polyline, CircleMarker
	, TileLayer, Tooltip } from 'react-leaflet'
import './style.less';
import 'leaflet/dist/leaflet.css';

export class Map extends React.PureComponent {
	static defaultProps = {
		defaultZoom: 10,
		defaultCenter: [45, 2],
		colors: ["red", "blue", "yellow", "green", "purple", "black", "cyan", "rose", "grey"]
	}

	constructor(props) {
		super(props)
		this.state = {
			center: props.defaultCenter,
			zoom: props.defaultZoom
		}
	}

	doUpdateMap = (state)=>{
		return new Promise((resolve)=>{
			this.setState(state, resolve)
		})
	}

  	render() {
		let {center, zoom, polylines, start, startTooltip, end, endTooltip, startTooltipDirection, endTooltipDirection} = this.state;
		let {children, setRefMap, colors, width, height} = this.props;

		if(polylines && !(polylines instanceof Array)) polylines = [polylines];

		var style = {
			width, 
			height
		}
			
		return <div id="mapWrapper" className="mapWrapper">
			<LeafletMap animate={false} duration={0} style={style} center={center} zoom={zoom} ref={setRefMap}>
				<TileLayer
					url="https://c.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png"
				/>

				<>
					{!polylines ? null : (
						polylines.map((polyline, i)=>{
							return <Polyline
								key={i}
								positions={polyline}
								color={colors[i % (colors.length - 1)]}
								weight={4}
							/>
						})
					)}
				</>

				{start ? <CircleMarker radius={7} center={start} fillColor="red" fillOpacity={1} color="red">
					{startTooltip ? <Tooltip
						permanent
						key={startTooltip}
						direction={startTooltipDirection || "top"}
					>
						{startTooltip}
					</Tooltip> : null}
				</CircleMarker> : null}

				{end ? <CircleMarker radius={7} center={end} fillColor="blue" fillOpacity={1} color="blue" >
					{endTooltip ? <Tooltip
						key={endTooltip}
						permanent
						direction={endTooltipDirection || "bottom"}
					>
						{endTooltip}
					</Tooltip> : null}
				</CircleMarker> : null}

				{React.cloneElement(children, {
					doUpdateMap: this.doUpdateMap
				})}
			</LeafletMap>
		</div>;
  }
}



/*<Obj />
@withLeaflet
class Obj extends React.PureComponent {
	componentDidMount() {
		setTimeout(()=>{
			let map = window.leaflet.map;
			LeafletImage(map, function(err, canvas) {
				// now you have canvas
				// example thing to do with that canvas:
				var img = document.createElement('img');
				var dimensions = map.getSize();
				img.width = dimensions.x;
				img.height = dimensions.y;
				img.src = canvas.toDataURL();
				document.body.appendChild(img);
			})
		}, 3000);
	}
	render() {
		window.leaflet = this.props.leaflet;
		console.log(this.props.leaflet);
		return <div>test</div>
	}
}*/