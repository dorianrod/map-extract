import {isArray, get, sortBy} from 'lodash';
import XML2JSON from 'xmltojson';
import {LatLng} from 'leaflet'

export async function GPX2JSON(file, offsetDistance = 0) {
    let string = await readFile(file)
    let json   = await xml2json(string);
    
    var jsonReader = new JSONReader();
    var traces   = [];

    let trk      = get(json, "gpx[0].trk", []) ;
    trk.forEach((trk)=>{
        let name = jsonReader.innerText(trk.name);
        let points = [];
        let trkpt = get(trk, "trkseg[0].trkpt") || [];
        trkpt.forEach((pt)=>{
            points.push([jsonReader.attr(pt,"lat"), jsonReader.attr(pt, "lon")]);
        })
        traces.push({
            index: traces.length,
            name,
            points
        })
    })

    traces.forEach((trace)=>{
        var points = trace.points;
        var distances = trace.distances = [];
        points.forEach((pt, i)=>{
            if(i >= 1) {
                let precPt          = new LatLng(points[i - 1][0], points[i - 1][1]);
                let curPt           = new LatLng(pt[0], pt[1]);
                var distFromPrec    = curPt.distanceTo(precPt);

                distances.push({
                    dist: distFromPrec,
                    distCum: distances[i - 1].distCum + distFromPrec
                })

            } else {
                
                distances.push({
                    dist: 0,
                    distCum: offsetDistance
                })
            }
        })
    })

    traces = sortBy(traces, (trace)=>{
        return -trace.points.length;
    })

    var trace    = {
        name: file.name,
        traces
    };

    return trace
}   

function xml2json(s) {
    return XML2JSON.parseString(s);
}

function readFile(file) {
    return new Promise((resolve, reject)=>{
        const reader = new FileReader()
        reader.onabort = reject
        reader.onerror = reject
        reader.onload = () => {
            const binaryStr = reader.result
            resolve(binaryStr)
        }
        reader.readAsText(file)
    });
}


class JSONReader {
	attr(node, attr) {
		if(node._attr && node._attr[attr]) {
			return node._attr[attr]._value;
		}
		return null;
	}
	
	innerText(node) {
		if(isArray(node) && node.length == 1) {
			return isArray(node[0]._text) ? null: node[0]._text;
		}
		return null;
	}
	
	isChildMainNode(node, child) {
		if(node && node[child] && node[child].length == 1) return true;
		return false;
	}
	
	isChildExist(node, child) {
		if(node && node[child] && node[child].length >= 0) return true;
		return false;
	}
};
