const img_max_preloaded_count = 100;
const img_displayed_count = 2;
const blacklistedTags = ['yaoi', 'lolicon', 'vore'];

function OnLoad() {
    const code_input = $("input[type=text]")[0];
    $("button")[0].addEventListener('click', function () {
        Search(code_input.value);
    });
    $("#copy-to-clipboard").click(function () { CopyToClipBoard($(this)) });
}

function Search(value) {
    if (!(parseInt(value) > 0) || !(value.length < 7 && value.length > 0))
        return;
    console.log("Search: " + value);
    var link = "https://nhentai.net/g/" + value;
    $.ajax({
        url: link,
        type: 'GET',
        success: function (page) {
            var data = ProcessPage(page);
            data.link = link;
            console.log(data);
            DisplayContent(data);
        },
        error: function (err) {
            console.log("Not found!");
        }
    });
}

function ProcessPage(page) {
    var doc = (new DOMParser()).parseFromString(page, "text/html");
    var title = doc.getElementsByClassName("title")[0].textContent;
    var tags = [];
    var srcs = [];
    var link = "";
    var tagsContainer = null;
    for (var el of doc.querySelectorAll("div .tag-container")) {
        if (el.textContent.includes("Tags")) {
            tagsContainer = el;
            break;
        }
    }
    var tagElements = tagsContainer.getElementsByTagName("a");
    if (tagElements.length > 0) {
        var tags_string = "";
        Array.from(tagElements).forEach(el => {
            tags_string += el.getElementsByClassName("name")[0].textContent + ",";
        });
        tags_string = tags_string.slice(0, -1);
        tags = tags_string.split(',');
    }
    var imgs = doc.querySelectorAll('.thumb-container img.lazyload');
    console.log(srcs);
    for (let index = 0; index < img_max_preloaded_count && index < imgs.length; index++) {
        srcs.push(imgs[index].getAttribute("data-src"));
    }
    return { title: title, tags: tags, srcs: srcs, link: link };
}

function DisplayContent(data) {
    var container = $("#search-result");
    if (container.hasClass("hidden")) {
        container.removeClass("hidden");
    }
    container.hide().fadeIn(1000);
    RemoveImages();

    var info_div = $("#short-info");
    var containsBlacklistedTags = false;

    if (data.tags.length > 0) {
        var tags_html = "<b>Tags:</b>  ";

        data.tags.forEach(tag => {
            tags_html += "<span class='tag" + (blacklistedTags.includes(tag) ? " blacklisted" : "") + "'>" + tag + "</span> ";
            containsBlacklistedTags = containsBlacklistedTags || blacklistedTags.includes(tag);
        });
        $("P", info_div).html(tags_html);
    }
    else{
        $("P", info_div).html("<B>No tags</B>");
    }

    data.srcs.filter((img_src, id) => id < img_displayed_count).forEach(img_src => { AddImage($("#search-result"), img_src, containsBlacklistedTags); });
    $("H2", info_div).text(data.title);
    $("#copy-to-clipboard").data("link", data.link);
    $("#show-next-image").off('click');
    $("#show-next-image").click(function (event) { if (data.srcs[$("img").toArray().length]) { AddImage($("#search-result"), data.srcs[$("img").toArray().length], containsBlacklistedTags); event.stopPropagation(); 
        //setTimeout(function () { window.scrollTo(0, document.body.scrollHeight); }, 300);
        //$("#bottom")[0].scrollIntoView({block: "center", behavior: "smooth"});
        setTimeout(function () { $("#bottom")[0].scrollIntoView({block: "center", behavior: "smooth"}); }, 300);
     } });
    $(document).off('click');
    $(document).on("click", "img.interactable", function () { $(this).toggleClass("blurred"); });
}

function RemoveImages() {
    $("img").toArray().forEach(element => {
        element.remove();
    });
}

function AddImage(container, src, blurred = false) {
    var img = document.createElement("img");
    img.setAttribute("src", src);
    container.append(img);
    if (blurred)
        $(img).addClass("blurred interactable");
    $(img).hide().fadeIn(2000);
}

function CopyToClipBoard(el) {
    navigator.clipboard.writeText(el.data("link"));
    var defhtml = el.html();
    setTimeout(function () { el.html(defhtml) }, 3000);
    console.log(el.data("link"));
    el.html("Copied!");
}

document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        OnLoad();
    }
}

//412
//421
//531
//512
//737
//473
//6436 <--oft
//348223