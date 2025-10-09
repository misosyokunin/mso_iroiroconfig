javascript:(() => {

VERSION = "2.1.0";

if(document.getElementById("____settingDialog")){
	alert("すでに起動済みです。");
	return;
}


const Settings = [
	{
		text: "ニコちゃんマークの両サイドをクリックした場合に新規ゲームに遷移しないようにする",
		id: "____disabledNewGameWhenClickSmileIconSides",
		isHtmlStyle: false,
		style: `
#GameBlock:not(:has(#result_block_box)) #top_area{
	pointer-events: none;
}
#GameBlock:not(:has(#result_block_box)) #top_area_face{
	pointer-events: auto;
}
`,
	},
	{
		text: "【モバイル】サイト内でオーバースクロールを無効にする",
		id: "____disabledOverScrollBehavior",
		isHtmlStyle: true,
		style: `
{
	overscroll-behavior: none;
}
`,
	},
	{
		text: "【モバイル】友好イベントで「イベントクエスト」の欄に赤丸🔴が点いている場合、ドロワーメニューボタンに特別なアイコンを表示する",
		id: "____showFishIconWhenEventQuestsMenuOnFriendEvent",
		isHtmlStyle: false,
		style: `
body:has(li.link_friend_quests .fa-circle) #header-new-icon span.header-icon-absolute > i:after {
	content: "🐟️";
}
`,
	},
	{
		text: "デイリークエスト内の『変更する』ボタンを押せないようにする",
		id: "____disabledReplaceAtDairyQuests",
		isHtmlStyle: false,
		style: `
#QuestsBlock > table:nth-last-of-type(2) button[id*=replace_btn] {
	opacity: 0.5;
	pointer-events: none;
}
#QuestsBlock > table:nth-last-of-type(2) button[id*=replace_btn]:after {
	content: "🐟️";
}
`,
	},
	{
		text: "月間クエスト内の『変更する』ボタンを押せないようにする",
		id: "____disabledReplaceAtMonthQuests",
		isHtmlStyle: false,
		style: `
#QuestsBlock > table:nth-last-of-type(1) button[id*=replace_btn] {
	opacity: 0.5;
	pointer-events: none;
}
#QuestsBlock > table:nth-last-of-type(1) button[id*=replace_btn]:after {
	content: "🐟️";
}
`,
	},
	{
		text: "デイリークエスト内の『ダウングレード』ボタンを押せないようにする",
		id: "____disabledDowngrade",
		isHtmlStyle: false,
		style: `
#QuestsBlock button[id*=downgrade_btn] {
	opacity: 0.5;
	pointer-events: none;
}
#QuestsBlock button[id*=downgrade_btn]:after {
	content: "🐟️";
}
`,
	},
	{
		text: "自分用メモ内の「削除メッセージ」を非表示にする",
		id: "____hiddenDeletedMessageInMyMemo",
		isHtmlStyle: false,
		style: `
#ChatBlock:has(#chat_tabs > .active img[src="/img/chat/notes.svg"]) #chat_messages > div > div:has(td:nth-of-type(2) span.gray) {
	display: none;
}
`,
	},
	{
		text: "リプレイの操作バーを画面下部に追随させる",
		id: "____stickyBottomReplayFooter",
		isHtmlStyle: false,
		style: `
#GameBlock:has(#result_block_box) #replay_footer {
	position: sticky;
	bottom: 0px;
}
#GameBlock:has(#result_block_box) #replay_play_btn,
#GameBlock:has(#result_block_box) #replay_pause_btn{
	position: sticky;
	left: 10px;
	z-index: 100;
}
#GameBlock:has(#result_block_box) .replay-button-column:nth-of-type(3){
	position: sticky;
	left: 43px;
	z-index: 100;
}
#GameBlock:has(#result_block_box) .replay-button-column:nth-of-type(4){
	position: sticky;
	left: 75px;
	z-index: 100;
}
`,
	},
];









const Functions = [
	{
		text: "ページネーションでジャンプする（『_p』）",
		function: function(){
			const result = window.prompt("ジャンプしたいページ番号を入力してね", 1);
			if(result){
				_p(result);
			}
		},
	},

];

const Scripts = {};
{
	const id = "____ScrollPageAtEquipment";
	Scripts[id] = {
		text: "装備のページで更新時に元のブロックに戻るようにする（仮称）",
		detail: "",
	};
	Scripts[id]["script"] = function(){
		if(!location.href.endsWith("/equipment")){
			return;
		}
		const tar = event.target.closest("button");
		if(tar?.tagName !== "BUTTON"){
			return;
		}
		
		/*名誉ショップのボタンは挙動が違うので、対応できません*/
		if(!document.getElementById("EquipmentBlock").contains(tar)){
			return;
		}
		
		let blocks = document.querySelectorAll("#EquipmentBlock > :is(div, table)");
		let parentNum = null;
		for(let i = 0; i < blocks.length; i++){
			const block = blocks[i];
			if(block.querySelector("h2")){
				parentNum = i;
			}
			if(block.contains(tar)){
				break;
			}
		}
		
		let senni = false;
		const target = document.body;
		const observer = new MutationObserver(async (mutations) => {
			const tar = mutations[0].target;
/*
				console.log(tar);
*/
				if(tar.classList.contains("modal") ||
				   tar.classList.contains("modal-open")){
					observer.disconnect();
					return;
				}
				if(tar.id === "EquipmentBlock"){
					if(senni){
						blocks = document.querySelectorAll("#EquipmentBlock > :is(div, table)");
						blocks[parentNum].scrollIntoView({  
						  behavior: 'smooth'  
						});
						observer.disconnect();
						return;
					}
					senni = true;
				}
		});
		observer.observe(target, {
 			attributes: true, // 属性変化の監視
 			characterData: true,	/*テキストノードの変化を監視*/
			childList: true,	/*子ノードの変化を監視*/
			subtree: true,	/*子孫ノードも監視対象に含める*/
		});
	};
	Scripts[id]["start"] = function(){
		document.body.addEventListener("click", Scripts[id].script);
	};
	Scripts[id]["end"] = function(){
		document.body.removeEventListener("click", Scripts[id].script);
	};
}
{
	const id = "____addSendQuestButtonInFriendsEvent";
	Scripts[id] = {
		text: "友好イベントのクエスト送付を、チャットのプレイヤー名をクリックした時のメニューから行えるようにする",
		detail: "",
		observer: null,
		addItemClass: "___sakanaScript1",
	},
	Scripts[id]["script"] = function(){
		if(!location.href.endsWith("/chat")){
			return;
		}
		const tar = event.target;
		if(!tar.closest("#chat_messages")){
			return;
		}
		const dropdown = tar.closest("span.dropdown");
		if(!dropdown){
			return;
		}
		const menu = dropdown.querySelector(":scope > ul.dropdown-menu > li");
		if(!menu){
			return;
		}
		
		const toSendId = dropdown.querySelector("a[id*=player_link]").href.match(/\d+/)[0];
		if(!menu.querySelector(`.${Scripts[id]["addItemClass"]}`)){
			const addItem = document.createElement("a");
			addItem.classList.add(Scripts[id]["addItemClass"]);
			addItem.textContent = "🐟️クエストを贈る";
			addItem.href = "javascript: void(0)";
			addItem.addEventListener("click", () => {
				navigate('friend-quests');
				
				const target = document.body;
				Scripts[id]["observer"] = new MutationObserver(async (mutations) => {
					const tar = mutations[0].target;
/*
						console.log(tar);
*/
						if(!location.href.endsWith("/friend-quests")){
							Scripts[id]["observer"].disconnect();
/*
							console.log("乙");
*/
							return;
						}
						if(tar.id === "send_quest_content"){
							const form = tar.querySelector("#user_autocomplete");
							if(form){
								form.value = toSendId;
								tar.querySelector("button").click(); /*決定ボタンを自動で*/
							}
						}
/*

贈るボタンを押した
<div id="send_quest_content"><div class="text-center"><div class="send-quest-option"><a href="javascript:void(0)"><img src="/img/events/friend/dice.svg" class="icon-friend-dice">ランダムなオンラインプレイヤーを選択する</a> <span title="" class="help mediumgray" data-original-title="ランダムなプレイヤーにクエストを送ると、他のプレイヤーからクエストを受け取る確率が高くなります。"><i class="fa fa-question-circle-o"></i></span></div><div class="send-quest-option"><a href="javascript:void(0)"><img src="/img/events/friend/user.svg" class="icon-friend-user">ID/ユーザー名でプレイヤーを選択する</a></div><div class="send-quest-option">お気に入りの連絡先</div><div class="send-quest-option"><div><a href="javascript:void(0)" class="text-nowrap-inline"><img src="/img/flags/jp.png" class="player-flag" alt="JP"><span>aquacat／medium😻</span></a>&nbsp;&nbsp;&nbsp;<a href="javascript:void(0)" class="text-nowrap-inline"><img src="/img/flags/jp.png" class="player-flag" alt="JP"><span>akim</span></a>&nbsp;&nbsp;&nbsp;<a href="javascript:void(0)" class="text-nowrap-inline"><img src="/img/flags/jp.png" class="player-flag" alt="JP"><span>smiley_eff,exp,gem,AC</span></a>&nbsp;&nbsp;&nbsp;<a href="javascript:void(0)" class="text-nowrap-inline"><img src="/img/flags/jp.png" class="player-flag" alt="JP"><span>3156(Shima)</span></a>&nbsp;&nbsp;&nbsp;<a href="javascript:void(0)" class="text-nowrap-inline"><img src="/img/flags/jp.png" class="player-flag" alt="JP"><span>SkyBerryFields (Eff, Passives)</span></a>&nbsp;&nbsp;&nbsp;<a href="javascript:void(0)" class="text-nowrap-inline"><img src="/img/flags/jp.png" class="player-flag" alt="JP"><span>Hape｜pvp,int</span></a>&nbsp;&nbsp;&nbsp;<a href="javascript:void(0)" class="text-nowrap-inline"><img src="/img/flags/jp.png" class="player-flag" alt="JP"><span>Clematis(NF,exp,cus)</span></a>&nbsp;&nbsp;&nbsp;</div></div></div></div>
IDユーザー名でを押す
<div id="send_quest_content"><div id="SearchBlock"><div id="SearchBlock_error_message" class="alert alert-danger hide"></div><div class="form-horizontal"><div class="form-group form-group-player-info"><div class="col-xs-5 control-label"><strong>プレイヤーID/ユーザー名を選択：</strong></div><div class="col-xs-5"><input id="user_autocomplete" class="form-control" autocomplete="off"></div></div><div class="form-group form-group-player-info"><div class="col-xs-5 control-label"></div><div class="col-xs-5"><br><button class="btn btn-primary"><i class="fa fa-chevron-circle-right"></i> 決定</button></div></div></div></div></div>


*/

				});
				Scripts[id]["observer"].observe(target, {
		 			attributes: true, // 属性変化の監視
		 			characterData: true,	/*テキストノードの変化を監視*/
					childList: true,	/*子ノードの変化を監視*/
					subtree: true,	/*子孫ノードも監視対象に含める*/
				});
				
				
				return false;
			});
			menu.append(addItem);
		}
		
		
		return;
	};
	Scripts[id]["start"] = function(){
		document.body.addEventListener("click", Scripts[id].script);
		/*iframeを作る*/
	};
	Scripts[id]["end"] = function(){
		document.body.removeEventListener("click", Scripts[id].script);
		/*iframeを消す*/
		Scripts[id]["observer"]?.disconnect();
		Array.from(document.querySelectorAll(`.${Scripts[id]["addItemClass"]}`)).forEach((ele) => ele.remove());
	};
}

const Hotkeys = [
	{
		text: "チャットのショートカットキーを有効にする",
		detail: "<kbd>D</kbd>最後の自分のメッセージの削除ボタンを押す<br/><kbd>Enter</kbd>削除ダイアログで「OK」を押す<br/><kbd>Escape</kbd>削除ダイアログで「キャンセル」を押す",
		id: "hotkeysAtChat",
		script: function(e){
			if(!location.href.endsWith("/chat")){
				return;
			}
			if(document.activeElement.id === "chat_new_message"){
				return;
			}
			if(e.code === "KeyD"){
				Array.from(document.querySelectorAll("#chat_messages > div:not([style*=none]) .chat-remove-icon")).at(-1)?.click();
			}
			if(e.code === "Enter"){
				if(document.getElementById("ConfirmDialog").getAttribute("style")?.match("display: block")){
					document.getElementById("ConfirmDialog_ok_btn").click();
				}
			}
			if(e.code === "Escape"){
				if(document.getElementById("ConfirmDialog").getAttribute("style")?.match("display: block")){
					document.getElementById("ConfirmDialog_cancel_btn").click();
				}
			}
		},
	},
];




const Style = document.createElement("style");
Style.innerHTML = `
#____settingDialog {
	position: fixed;
	top: 0px;
	left: 0px;
	z-index: 100;
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	padding: 10%;
	background-color: rgba(0, 0, 0, 0.5);
}
#____settingDialog:not(.open){
	display: none;
}
#____settingDialog main {
	display: flex;
	flex-direction: column;
	height: 90%;
	background-color: #111;
	padding: 5%;
	overflow-y: scroll;
}
#____settingDialog main section{
	display: flex;
	flex-direction: column;
}
#____settingDialog footer {
	height: 10%;
	background-color: #111;
	display: flex;
	justify-content: space-around;
}

#____settingDialog main label {
	cursor: pointer;
}
#____settingDialog main input[type="checkbox"] {
	transform: scale(1.5);
	margin-right: 10px;
}
#____settingDialog main p {
	margin-left: 1em;
}
#____settingDialog main kbd {
	background-color: #DDD;
	color: #000;
	min-width: 2em;
	display: inline-block;
	text-align: center;
	border: solid 1px #000;
	margin: 5px 10px;
}
`;

const MyStorage = new class{
	#storagename;
	#datas;
	constructor(){
		this.#storagename = "_魚頭男_S005_datas";
/*
		window.addEventListener("beforeunload", this.save);
*/
		this.load();
	}
	get(key){
		return this.#datas[key];
	}
	set(key, value){
		return this.#datas[key] = value;
	}
	has(key){
		return !!this.#datas[key];
	}
	remove(key){
		delete this.#datas[key];
	}
	save(){
		const savedata = JSON.stringify(this.#datas);
		localStorage.setItem(this.#storagename, savedata);
	}
	load(){
		const loaddata = localStorage.getItem(this.#storagename);
		if(loaddata){
			this.#datas = JSON.parse(loaddata);
		}else{
			this.clear();
		}
	}
	clear(){
		this.#datas = {};
	}
	size(){
		return Object.keys(this.#datas).length;
	}
};

const Dialog = document.createElement("div");
Dialog.id = "____settingDialog";
document.body.append(Dialog);
{
	const main = document.createElement("main");
	Dialog.append(main);
	{
		{
			const section = document.createElement("section");
			main.append(section);
			const h2 = document.createElement("h2");
			h2.textContent = "切り替え";
			section.append(h2);
			Settings.forEach((list) => {
				const label = document.createElement("label");
				section.append(label);
				const checkbox = document.createElement("input");
				checkbox.type = "checkbox";
				checkbox.checked = MyStorage.get(list.id) ?? false;
				checkbox.id = list.id;
				checkbox.addEventListener("change", () => {
					const tar = event.currentTarget;
					MyStorage.set(tar.id, tar.checked);
					MyStorage.save();
				});
				label.append(checkbox);
				const span = document.createElement("span");
				span.textContent = list.text;
				label.append(span);
				const addStyle = list.isHtmlStyle ? `html:has(#${list.id}:checked)${list.style}` : `html:has(#${list.id}:checked){${list.style}}`;
				Style.innerHTML += addStyle;
			});
		}
		{
			const section = document.createElement("section");
			main.append(section);
			const h2 = document.createElement("h2");
			h2.textContent = "スクリプト";
			section.append(h2);
			Object.entries(Scripts).forEach(([key, list]) => {
				const label = document.createElement("label");
				section.append(label);
				const checkbox = document.createElement("input");
				checkbox.type = "checkbox";
				checkbox.checked = MyStorage.get(key) ?? false;
				checkbox.id = key;
				checkbox.addEventListener("change", () => {
					const tar = event.currentTarget;
					MyStorage.set(tar.id, tar.checked);
					MyStorage.save();
					tar.toggleFunction(tar.checked);
				});
				checkbox.toggleFunction = function(boo){
					if(boo){
						list.start();
					}else{
						list.end();
					}
				};
				checkbox.toggleFunction(checkbox.checked);
				label.append(checkbox);
				const span = document.createElement("span");
				span.textContent = list.text;
				label.append(span);
				const p = document.createElement("p");
				p.innerHTML = list.detail;
				label.append(p);
			});
		}
		{
			const section = document.createElement("section");
			main.append(section);
			const h2 = document.createElement("h2");
			h2.textContent = "ショートカットキー";
			section.append(h2);
			Hotkeys.forEach((list) => {
				const label = document.createElement("label");
				section.append(label);
				const checkbox = document.createElement("input");
				checkbox.type = "checkbox";
				checkbox.checked = MyStorage.get(list.id) ?? false;
				checkbox.id = list.id;
				checkbox.addEventListener("change", () => {
					const tar = event.currentTarget;
					MyStorage.set(tar.id, tar.checked);
					MyStorage.save();
					tar.toggleFunction(tar.checked);
				});
				checkbox.toggleFunction = function(boo){
					if(boo){
						window.addEventListener("keydown", list.script);
					}else{
						window.removeEventListener("keydown", list.script);
					}
				};
				checkbox.toggleFunction(checkbox.checked);
				label.append(checkbox);
				const span = document.createElement("span");
				span.textContent = list.text;
				label.append(span);
				const p = document.createElement("p");
				p.innerHTML = list.detail;
				label.append(p);
			});
		}
		{
			const section = document.createElement("section");
			main.append(section);
			const h2 = document.createElement("h2");
			h2.textContent = "一時機能";
			section.append(h2);
			Functions.forEach((list) => {
				const button = document.createElement("button");
				button.type = "button";
				button.textContent = list.text;
				button.addEventListener("click", list.function);
				section.append(button);
			});
		}
	}
	const footer = document.createElement("footer");
	Dialog.append(footer);
	{
		const closeButton = document.createElement("button");
		closeButton.type = "button";
		closeButton.textContent = "設定を閉じる";
		closeButton.addEventListener("click", closeDialog);
		footer.append(closeButton);
	}
	{
		const closeButton = document.createElement("button");
		closeButton.type = "button";
		closeButton.textContent = "このスクリプトを終了する";
		closeButton.addEventListener("click", endScript);
		footer.append(closeButton);
	}
	
}
document.body.append(Style);

const openButton = document.createElement("button");
openButton.type = "button";
openButton.textContent = `🐟️設定🐟️（ver:${VERSION}）`;
openButton.addEventListener("click", openDialog);
document.body.append(openButton);


function openDialog(){
	Dialog.classList.add("open");
}
function closeDialog(){
	Dialog.classList.remove("open");
}
function endScript(){
	Hotkeys.forEach((list) => {
		const chk = document.getElementById(list.id).toggleFunction(false);
	});
	Style.remove();
	Dialog.remove();
	openButton.remove();
}





})();
