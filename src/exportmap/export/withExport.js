import React from 'react';
import html2canvas from 'html2canvas';
import {asyncWait} from '../helpers/asyncWait';
import {canvasToGrayscale} from './colorHelper';

//HOC to export map to image file
export function withExport(C) {
	@withImageToBase64
	class withExport extends React.PureComponent {
		doExportMap = async (name, container)=>{
			try {
				let {doTransformImages, greyscale} = this.props;
				await doTransformImages(container); //need to transform "https://..." images to dataurl as html2canvas seem to not work properly without this step even with allowTaint parameter passed to html2canvas
				
				let canvas = await html2canvas(container);
				if(greyscale && canvas) {
					await canvasToGrayscale(canvas);
				}

				let blob   = await new Promise((resolve)=>{
					canvas.toBlob(resolve, "image/jpeg");
				})
				var url	   = URL.createObjectURL(blob);

				//Generate download
				this.downloadLink(name, url);

				return url;
				//URL.revokeObjectURL(url);
			} catch(err) {
				console.error(err);
			}
		}

		downloadLink(name, url) {
			//Generate download
			var link = document.createElement('a');
			link.href = url;
			link.download = name;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}

		doExportFile = async (name, string)=>{
			var blob = new Blob([string], {type : 'application/json'});
			var url	   = URL.createObjectURL(blob);
			this.downloadLink(name, url);
		}

		render() {
			return <C
				{...this.props}
				doExportMap={this.doExportMap}
				doExportFile={this.doExportFile}
			/>
		}
	}

	return withExport;
}

//Add transformImages
function withImageToBase64(C) {
	const transformImages = async (wrapper)=>{
		var promises = []
		$(wrapper).find("img").each((i, img)=>{
			var p = fetch(img.src)
			.then( response => {
				return response.blob() 
			})
			.then( blob =>{
				return new Promise((resolve)=>{
					var reader = new FileReader() ;
					reader.onload = () => { 
						let src = "data:image/png;base64;" + reader.result;
						img.src = src;
						img.onload = resolve
					};
					reader.onerror = function(err){ 
						reject(err) 
					};
					reader.readAsDataURL(blob) ;
				})
			}) ;

			promises.push(p);
		})

		var ret = await promises;
		await asyncWait(1000);

		return ret;
	}

	return React.memo((props)=>{
		return <C
			{...props}
			doTransformImages={transformImages}
		/>
	})
}
