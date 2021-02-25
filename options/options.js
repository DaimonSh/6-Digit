function save()
{
    var tagsString = document.getElementById('dislikedTags').value.replaceAll(/\ |\,|\n/ig,' ').trim().replace(/\s+/g, " ");
    chrome.storage.sync.set({"dislikedTags":tagsString.split(' ')}, function() {
        console.log(tagsString.split(' '));
        $("#status").text("Settings saved!");
        if($("#status").classList.contains("hidden"))
        {
            $("#status").classList.remove("hidden");
        }
    });
}

function success() {
    console.log("saved");
}

function logError(error) {
    console.log(error)
}

function DOMLoaded() {
    document.getElementById('save').addEventListener('click', save);

    chrome.storage.sync.get('dislikedTags', function(result){
        document.getElementById('dislikedTags').value = result.dislikedTags.toString().replaceAll(',',' ');
        channels = result;
        console.log(result);
        console.log(result.dislikedTags.toString().replaceAll(',',' '));
    });
}

//document.addEventListener('DOMContentLoaded', DOMLoaded);