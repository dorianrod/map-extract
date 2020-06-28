import React from 'react';
import {getBoundsByCenterAndZoom, getNewBounds, getTooltipDirection} from '../map/helper';
import {formatDistance} from '../helpers/distance';

//https://wiki.openstreetmap.org/wiki/FR:Zoom_levels

const shrinkCoeff = -0.05;


export function withConfig(C) {
	class withConfig extends React.PureComponent {
		
		getConfigByTracks = (traces)=>{
			let {zoom, leaflet} = this.props;
			
			let map = leaflet.map;
			let viewports = [];

			//Get all polylines
			var polylines = [];
			for(var i = 0; i < traces.length; i++) {
				let {
					traces: segments
				} = traces[i];
				for(var j = 0; j < segments.length; j++) {
					let {
						points
					} = segments[j];
					if(j == 0) {
						//We assume segments[0] is the main trace as its the one with the greater number of points (tracks are sorted while importing). If a file contains more than one track, we use the first one to move along the trail
						polylines[0] = [...(polylines[0] || []), ...points];
					} else {
						polylines.push(points);
					}
				}
			}

			//For each file, we follow the first track and check if the point is inside a bound. if not, we create a new viewport (= screenshot)
			for(var i = 0; i < traces.length; i++) {
				let {
					//name,
					traces: segments
				} = traces[i];
				
				var points = segments[0].points;
				var dist   = segments[0].distances;

				let curViewport = {
					...getViewport({
						index: 0, 
						bounds: getBoundsByCenterAndZoom(map, points[0], zoom), 
						polylines,
						zoom,
						trace: traces[i],
						segment: segments[0]
					}),
					start: points[0],
					startTooltip: viewports.length ? viewports[viewports.length - 1].endTooltip : `Start`,
					distCumStart: "Start"
				}
		
				for(var j = 0; j < points.length; j++) {
					let lastPoint = j == points.length - 1;

					if( !curViewport.shrinkedBounds.contains(points[j]) && !curViewport.end || lastPoint) {
						curViewport.end 					= points[j];
						curViewport.endTooltipDirection 	= getTooltipDirection(curViewport.bounds, curViewport.end),
						curViewport.endTooltip 				= getLabel(dist[j-1].distCum, viewports.length + 2);
						curViewport.distCumEnd 				= getLabel(dist[j-1].distCum);
					}

					if(!curViewport.bounds.contains(points[j]) || lastPoint) {
						let newBounds = getNewBounds(map, curViewport.bounds, points[j], zoom, shrinkCoeff);

						let prevViewport = curViewport;
						viewports.push(curViewport);

						if(j < points.length - 1) {
							curViewport = {
								...getViewport({
									index: viewports.length, 
									bounds: newBounds, 
									prevViewport, 
									polylines,
									zoom,
									trace: traces[i],
									segment: segments[0]
								}),
								endTooltip: (viewports.length + 2),
								distCumStart: curViewport.distCumEnd
							}
						}
					}
				}
			}

			return viewports;

			/*
			return [{
				center: [45, 2],
				polylines:  [
					[[45, 2], [45.1, 2.2]]
				],
				zoom: 8,
				start: [45, 2],
				end: [45.1, 2.5],
				startTooltip: "Sec. A - km 3",
				endTooltip: "Sec. A - km 30"
			}, {
				center: [47, 2.2],
				polylines: [[[47, 2], [48.5, 2.2]], [[45, 2], [45.1, 2.2]]],
				zoom: 8,
				start: [47, 2.2],
				end: [48.5, 2.25],
				startTooltip: "Sec. A - km 30",
				endTooltip: "Sec. A - km 65"
			}]*/
		}
		render() {
			return <C
				{...this.props}
				getConfigByTracks={this.getConfigByTracks}
			/>
		}
	}

	return withConfig;
}


function getViewport({index, bounds, prevViewport, polylines, zoom, trace, segment}) {
	return {
		imageName: ('0000' + index).substr(-4) + ".jpg",
		polylines,
		bounds: bounds,
		shrinkedBounds: bounds.pad(shrinkCoeff),
		center: bounds.getCenter(),
		zoom,
		segment,
		trace,
		start: prevViewport ? prevViewport.end : null,
		startTooltip: prevViewport ? prevViewport.endTooltip : "Start",
		startTooltipDirection: prevViewport ? getTooltipDirection(bounds, prevViewport.end) : null,
		endTooltip: null
	}
}

function getLabel(distance, index) {
	return formatDistance(distance) + (index !== undefined ? " (" + index + ")" : "");
}
