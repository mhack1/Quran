
function load_suras() {
    p = $.ajax({
      url: "json/suras.json",
      dataType: 'json'
    });

    p.done(function(data) {
        str = '';
        for (var i=0; i < data.length ; i++) {
            sura = data[i];
            str += (i+1) + ' <a class="sura_link" href="" ';
            str += 'data-page="' + sura.page +'" >';
            str += sura['name'] + '</a><br>';
        } 
        $('#suras').html(str);
    });
}


function sura_clicked(event) {
    event.preventDefault();
    event.stopPropagation();
    el = event.target;
    page = $(el).data('page');
    // console.log('Sura Clicked!' + page);
    load_page(page);
}

function load_page(page) {
    $page = $('#page');
    $page.html('');
    $taf = $('#tafseer');
    $taf.html('');

    if (page<10) {
        page_str = '00'+page;
    } else if (page<100) {
        page_str = '0'+page;
    } else {
        page_str = ''+page;
    }
    $page.css('background-image', 'url(img/'+page_str+'.jpg)');

    // aya segments
    p = $.ajax({
      url: "json/page_" +page+".json",
      dataType: 'json'
    });

    p.fail(function(data) {
        console.log('Failed to load page map!');
    });

    p.done(function(data) {
        for (var i=0; i < data.length ; i++) {
            aya = data[i];
            // console.log('Sura:' + aya.sura_id+' Aya:'+aya.aya_id);
            $a = $('<a>')
            $a.attr('href', '#'+aya.aya_id);
            $a.data('sura', aya.sura_id);
            $a.data('aya', aya.aya_id);
            $a.addClass('aya_link');
            for (var j=0; j < aya.segs.length ; j++) {
                seg = aya.segs[j];
                if (seg.w !=0 && seg.w < 30) continue;
                if (seg.x < 30) {
                    seg.w += seg.x;
                    seg.x = 0;
                }
                $d = $('<div>')
                .css('top', seg.y+'px')
                .css('left', seg.x+'px')
                .css('width', seg.w+'px')
                .css('height', seg.h+'px');
                $a.append($d);
                // console.log('Segment:'+aya.sura_id+' Aya '+aya.aya_id);
            }
            $page.append($a);
        } 
    });

}

function aya_clicked(event) {
    event.preventDefault();
    event.stopPropagation();
    el = $(event.target).closest('a');
    sura = el.data('sura');
    aya = el.data('aya');
    $('a.aya_link').removeClass('active');
    el.addClass('active');
    // console.log('Aya Clicked!' + sura + ' ' + aya);
    load_aya(sura, aya);
}

function load_aya(sura, aya) {
    var tafseer_name = Array('مشكل','نصي','الجلالين','الميسر', 'ابن كثير');
    $taf = $('#tafseer');
    $taf.html('');

    p = $.ajax({
      url: "json/aya_" +sura+"_"+aya+".json",
      dataType: 'json'
    });

    p.fail(function(data) {
        console.log('Failed to load Tafseer!');
    });

    p.done(function(data) {
        str = '';
        for (var i=0; i < data.length ; i++) {
            taf = data[i];
            str += '<strong>'+tafseer_name[taf.type]+'</strong><br>'+taf.text+'<hr>';
        } 
        $taf.html(str);
    });
}



$(function () {

    console.log('JQuery Started!');
    load_suras();
    load_page(1);
    $(document).on('click', 'a.sura_link', sura_clicked);
    $(document).on('click', 'a.aya_link', aya_clicked);
});
