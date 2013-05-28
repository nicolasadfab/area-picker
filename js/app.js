var AreaPicker = {
    exdm: null,
    step: 0,
    selected: null,
    result: {
        area: {}
    },
    
    init: function ()
    {
        'use strict';
        
        AreaPicker.bindEvents();
    },
    
    bindEvents: function ()
    {
        'use strict';
        
        $('#start-btn').bind('click', function ()
        {
            AreaPicker.nextStep();
            $('#popin-wrapper').hide();
            var local = {
                    // fallback swf
                    swf: '../easyxdm/easyxdm.swf',
                    //remote file
                    remote: $('#iframe-xdm').val(),
                    //
                    container: document.getElementById("iframe-wrapper"),
                    width: '100%',
                    //container
                    onReady: AreaPicker.easyXDMReady
            },
            remote = {
                    // existing remote service that can be called
                    remote: {
                        embed: {},
                        bindEvents: {},
                        getUrl: {},
                        addStyle: {}
                    },
                    // local service that can be called
                    local: {
                        events: AreaPicker.getEvents
                    }
                };
            
            AreaPicker.exdm = new easyXDM.Rpc(local, remote);
        });
        
        $('#next-step').bind('click', function (e)
        {
            e.preventDefault();
            switch(AreaPicker.step) {
                case 0 :
                    break;
                case 1 :
                    AreaPicker.nextStep();
                    AreaPicker.addStyle();
                    break;
                case 2 :
                    if(AreaPicker.selected !== null) {
                        AreaPicker.nextStep();
                        AreaPicker.showElement();
                    }
                    break;
                case 3 :
                    AreaPicker.nextStep();
                    AreaPicker.showResult();
                    break;
            }
            
            return false;
        });
        
        $('#prev-step').bind('click', function (e)
        {
            e.preventDefault();
            switch(AreaPicker.step) {
                case 2 :
                    AreaPicker.prevStep();
                    AreaPicker.addStyle();
                    break;
                case 3 :
                    AreaPicker.prevStep();
                    $('#tip1').hide();
                    $('#tip3').hide();
                    $('#tip2').hide();
                    
                    $('iframe', '#iframe-wrapper').show();
                    $('#popin-wrapper').hide();
                    break;
                default :
                    break;
            }
            
            return false;
        });
    },
    
    showResult: function ()
    {
        AreaPicker.exdm.getUrl(
            {},
            function (rpcdata)
            {
                AreaPicker.result.url = rpcdata;
                
                console.log(AreaPicker.result);
            }
        );
    },
    
    showElement: function ()
    {
        var newEle = '';
        
        $('#tip1').hide();
        $('#tip2').show();
        $('#tip3').hide();
        
        $('iframe', '#iframe-wrapper').hide();
        $('#popin-wrapper').show();
        
        switch(AreaPicker.selected.type) {
            case 'IMG':
                newEle = '<img src="' + AreaPicker.selected.content.src
                    + '" width="' + AreaPicker.selected.content.width
                        + '" height="' + AreaPicker.selected.content.height + '" />';
                
                $('.dyna-content', '#tip2').html(newEle);
                AreaPicker.bindImgSelect();
                break;
            default:
                newEle = '<' + AreaPicker.selected.type.toLowerCase() + '>';
                newEle += AreaPicker.selected.content.src;
                newEle += '</' + AreaPicker.selected.type.toLowerCase() + '>';
                
                $('.dyna-content', '#tip2').html(newEle);
                AreaPicker.bindTextSelect();
                break;
        }
    },
    
    bindImgSelect: function ()
    {
        new Selection(
            $('.dyna-content', '#tip2'),
            $('.dyna-content img', '#tip2'),
            function (area)
            {
                var img = $('<img />'),
                    wrapper = $('<div />');
                    
                img.attr('src', $('.dyna-content img', '#tip2').attr('src'));
                
                img.css({
                        position: 'absolute',
                        top: '-' + area.y + 'px',
                        left: '-' + area.x + 'px'
                    });
                    
                wrapper.css({
                        position: 'relative',
                        width: area.width,
                        height: area.height,
                        overflow: 'hidden'
                    })
                    .append(img);
                
                AreaPicker.result.area.width = area.width;
                AreaPicker.result.area.height = area.height;
                $('.result-content', '#tip2').html(wrapper);
            }
        );
    },
    
    bindTextSelect: function ()
    {
        $('#tip2').bind('mouseup', function (e)
        {
            $('.result-content', '#tip2').html(window.getSelection().toString());
        });
    },
    
    addStyle: function ()
    {
        AreaPicker.exdm.addStyle(
            {
                css: '.playground-selected { border: 1px solid red; }'
                        + '* { cursor: crosshair !important; }'
            },
            function (rpcdata)
            {
                
            }
        );
        
        AreaPicker.exdm.bindEvents(
            {
                "events": 
                {
                    document: {
                        'evt': 'click',
                        'callback': 'clicked'
                    }
                }
            },
            
            function (rpcdata)
            {
                
            }
        );
    },
    
    easyXDMReady: function (e)
    {
        'use strict';

        $('iframe', '#iframe-wrapper')
            .height('100%')
            .width('100%')
            .css({
                padding: '0px',
                margin: '0px'
            });
        
        AreaPicker.exdm.embed(
            {
                "url": $('#iframe-url').val()
            },
            function (rpcdata)
            {
                
            }
        );
    },
    
    nextStep: function ()
    {
        AreaPicker.step++;
    },
    
    prevStep: function ()
    {
        AreaPicker.step = ((AreaPicker.step-1) > 0) ? (AreaPicker.step-1) : AreaPicker.step;
    },
    
    getEvents: function (e)
    {
        'use strict';
        
        AreaPicker.selected = JSON.parse(e);
        AreaPicker.result.area.y = AreaPicker.selected.clientY;
        AreaPicker.result.area.x = AreaPicker.selected.clientX;
        return;
    }
};

$(document).ready(AreaPicker.init);