function OnLoad() {
	const code_input = document.getElementById("code_input");
	const search_button = document.getElementById("search_button");
	const dj_imgs = document.getElementsByClassName("dj_image");
	const dj_title = document.getElementById("dj_title");
	const dj_tags = document.getElementById("dj_tags");
	const dj_link = document.getElementById("dj_link");
	const container_div = document.getElementById("short_info");

	var dislikedTags = [''];

	chrome.storage.sync.get('dislikedTags', function (result) {
		dislikedTags = result.dislikedTags;
		console.log(result);
	});

	if (search_button) {
		search_button.onclick = function () {
			console.log(code_input.value);
			$.ajax({
				url: "https://nhentai.net/g/" + code_input.value,
				type: 'GET',
				success: function (data) {
					var doc = (new DOMParser()).parseFromString(data, "text/html");
					var tagsContainer = null;
					var containsDislikedTags = false;
					for (const el of doc.querySelectorAll("div .tag-container")) {
						if (el.textContent.includes("Tags")) {
							tagsContainer = el;
							break;
						}
					}
					var tags = tagsContainer.getElementsByTagName("a");
					var imgs = doc.querySelectorAll('.thumb-container img.lazyload');
					console.log(imgs);
					if (container_div.classList.contains("hidden")) {
						container_div.classList.remove("hidden");
					}
					var tags_string = "";
					Array.from(tags).forEach(el => {
						if (dislikedTags.includes(el.getElementsByClassName("name")[0].textContent.replaceAll(' ', ''))) {
							containsDislikedTags = true;
							tags_string += "<span class='tag disliked'>" + el.getElementsByClassName("name")[0].textContent + "</span> ";
						}
						else {
							tags_string += "<span class='tag'>" + el.getElementsByClassName("name")[0].textContent + "</span> ";
						}

					});
					dj_tags.innerHTML = tags_string;
					dj_link.href = "https://nhentai.net/g/" + code_input.value;
					for (let index = 0; index < dj_imgs.length; index++) {
						console.log(imgs[index].getAttribute("data-src"));
						dj_imgs[index].src = imgs[index].getAttribute("data-src");
						if (containsDislikedTags) {
							dj_imgs[index].classList.add("blurred");
							dj_imgs[index].classList.add("interactable");
							dj_imgs[index].onclick = function () { this.classList.toggle("blurred"); };
						}
						else if (dj_imgs[index].classList.contains("interactable")) {
							dj_imgs[index].classList.remove("blurred");
							dj_imgs[index].classList.remove("interactable");
							dj_imgs[index].onclick = null;
						}
					}
					dj_title.innerText = doc.getElementsByClassName("title")[0].textContent;
				}
			});
		}
	}
}

document.onreadystatechange = function () {
	if (document.readyState == "complete") {
		OnLoad();
	}
}