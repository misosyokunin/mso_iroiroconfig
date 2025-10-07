javascript:(() => {

VERSION = "2.0.0";

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
#top_area{
	pointer-events: none;
}
#top_area_face{
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
body:has(.link_friend_quests .fa-circle) #header-new-icon span.header-icon-absolute > i:after {
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
				if(document.getElementById("ConfirmDialog").getAttribute("style").match("display: block")){
					document.getElementById("ConfirmDialog_ok_btn").click();
				}
			}
			if(e.code === "Escape"){
				if(document.getElementById("ConfirmDialog").getAttribute("style").match("display: block")){
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
