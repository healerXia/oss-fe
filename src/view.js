module.exports = {
	libs:['https',"vue",'view'],
	page:{
	    title:'index',
	    hash:false,
	    chunks:['https',"vue",'view','main'],
	    filename:'index.html',
	    template:'_tpl/tpl.html',
	    inject:'body'
	}
}