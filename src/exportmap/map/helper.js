import {Bounds, LatLngBounds, Marker} from 'leaflet';

export function getBoundsByCenterAndZoom(map, center, zoom) {
    var centerPoint 	= map.project(center, zoom);
    var viewHalf 		= map.getSize().divideBy(2);
    var viewBounds 		= new Bounds(centerPoint.subtract(viewHalf), centerPoint.add(viewHalf));
    let latlngBounds    = new LatLngBounds( map.unproject(viewBounds.min, zoom), map.unproject(viewBounds.max, zoom)) ;
    return latlngBounds;
}


export function translateBounds(map, latlngbounds, zoom, way, offset = 0) {
    var point 	    = map.project(latlngbounds.getCenter(), zoom);
    var viewSize 	= map.getSize();

   // offset =0;
    viewSize.y *= (1 + 2 * offset);
    viewSize.x *= (1 + 2 * offset);

    let newPoint;
    if(way == "N") {
        newPoint = point.subtract({x: 0, y: viewSize.y})
    } else if(way == "S") {
        newPoint = point.add({x: 0, y: viewSize.y})
    } else if(way == "W") {
        newPoint = point.subtract({x: viewSize.x, y: 0})
    } else if(way == "E") {
        newPoint = point.add({x: viewSize.x, y: 0})
    }

    let newCenter = map.unproject(newPoint, zoom);
    return getBoundsByCenterAndZoom(map, newCenter, zoom);
}

export function getNewBounds(map, precBounds, point, zoom, offset) {
	let newBounds = translateBounds(map, precBounds, zoom, "N").contains(point) ? translateBounds(map, precBounds, zoom, "N", offset) : (
		translateBounds(map, precBounds, zoom, "E").contains(point) ? translateBounds(map, precBounds, zoom, "E", offset) : (
			translateBounds(map, precBounds, zoom, "S").contains(point) ? translateBounds(map, precBounds, zoom, "S", offset) : (
				translateBounds(map, precBounds, zoom, "W").contains(point) ? translateBounds(map, precBounds, zoom, "W", offset) : null
			)
		)
	)

	return newBounds;
}

export function getTooltipDirection(bounds, latlng) {
    latlng      = (new Marker(latlng)).getLatLng();
    let center  = bounds.getCenter();
    let V = latlng.lat < center.lat ? "top" : "bottom";
    let H = latlng.lng < center.lng ? "right" : "left";
    return H;
}