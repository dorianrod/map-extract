import React from 'react';
import Dropzone from 'react-dropzone'
import { cx } from '../helpers/cx';

const withConvert = (C)=>{
    return React.memo((props)=>{
        return <C
            {...props}
        />
    })
}

@withConvert
export class DropArea extends React.PureComponent {
    onDrop = async (acceptedFiles) => {
        let {doConvertFile2GPX, onGpxDownload} = this.props;
        let gpxFiles = [];
        acceptedFiles.forEach((file)=>{
            gpxFiles.push( doConvertFile2GPX(file) );
        })

        var gpx = await Promise.all(gpxFiles);
        onGpxDownload(gpx);
    }

    render() {
        if(this.props.running || this.props.done) return null;
        
        return <Dropzone onDrop={this.onDrop} multiple >
            {({getRootProps, getInputProps}) => (
            <section className={cx({disabled: this.props.running}, "dropzone")}>
                <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>Drag 'n' drop one or more GPX files here</p>
                </div>
            </section>
            )}
        </Dropzone>
    }
}

