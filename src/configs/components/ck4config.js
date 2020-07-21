const ckconfig = {
  toolbarGroups: [
    { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
    { name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
    { name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
    { name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
    { name: 'forms', groups: [ 'forms' ] },
    { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
    { name: 'links', groups: [ 'links' ] },
    { name: 'insert', groups: [ 'insert' ] },
    { name: 'styles', groups: [ 'styles' ] },
    { name: 'colors', groups: [ 'colors' ] },
    { name: 'tools', groups: [ 'tools' ] },
    { name: 'others', groups: [ 'others' ] },
    { name: 'about', groups: [ 'about' ] }
  ],
  removePlugins: 'elementspath',
  removeButtons: 'Source,Save,NewPage,Preview,Print,Templates,Copy,Cut,Paste,PasteText,PasteFromWord,Find,Replace,SelectAll,Scayt,Form,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Subscript,Superscript,CopyFormatting,RemoveFormat,CreateDiv,BidiLtr,BidiRtl,Language,Anchor,Image,Flash,Smiley,PageBreak,Iframe,ShowBlocks,About,Styles,Format,Font,FontSize',
  extraPlugins: 'autogrow',
  autoGrow_minHeight: 200,
  autoGrow_maxHeight: 600,
  autoGrow_bottomSpace: 0,
  stylesSet: 'ck4config.js',
}
export default ckconfig;
