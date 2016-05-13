Dropzone.options.myAwesomeDropzone = {
	dictDefaultMessage:"Click or Drop files here to upload",
	createImageThumbnails: false,
	addedfile: function(file) { console.log(file); },
	init: function() {
		this.on("addedfile", function(file) { alert("Added file."); });
		this.on("uploadprogress",function(file,progress,bytesSent){
			console.log(progress)
		});
	}
}
jQuery(function(){
});