/*
	@author: Jimmy
	@QQ: 273165811
	@welcome to contact me!
*/
//全局变量
var time = 0;			//时间监听
var started = false;
var currentLamp = 0;	//当前页面拥有灯数
var lightBool = false;
var numComplete = 0;	//已完成个数
var randomList = [];	//随机答案
var scoreDiv = document.getElementById('score');
var score = parseInt(scoreDiv.innerHTML.split(':')[1]);

checkHtml();
setup();
startTimer();
lightLamp();
listenScore();

function checkHtml() {//检测当前所在关卡
	var href = window.location.href;
	var currentPage = href.split('/')[href.split('/').length - 1];
	if(currentPage == 'newGame.html') {
		currentLamp = 4;
	}
	if(currentPage == 'secondDoor.html?4') {
		currentLamp = 9;
	}
	if(currentPage == 'thirdDoor.html?13') {
		currentLamp = 15;
	}
}

function setup() {//初始化
	var grid = document.getElementsByTagName("td");
	randomList = randomGetList();
	for(var i = 0; i < grid.length; i++) {
		var cell = grid[i];
		cell.completed = false;
		cell.clicked = false;

		cell.addEventListener("mouseenter",function(){
            if(this.completed == false && this.clicked == false)
                this.style.background = "gray";
        });

        cell.addEventListener("mouseleave",function(){
            if(this.completed == false && this.clicked == false)
                this.style.background = "#DDDDDD";
        });

        cell.addEventListener("click",function(){
        	if (this.completed == false && this.clicked == false)
        		rightOrNot(this);
        });
	}
}

function rightOrNot(cell) {
	if(cell.id == randomList[numComplete]) {//回答正确
		cell.style.background = "#DDDDDD";
		cell.children[0].src = "res/lampYes.png";
		cell.clicked = true;
		numComplete ++;
	} else {//回答错误
		alert("可惜哦！回答错误");
		window.location.href = "addScore.html?"+score;
	}
}

function randomGetList() {
	var answers = [];
	for (var i = 0; i < currentLamp; i++) {
		answers.push(i);
	}
    answers.sort(function(item){
        return .5 - Math.random();
    })
    return answers;
}

function startTimer() {//游戏时钟
  if (started == false) {
    interval = setInterval(function () {
      time++;
      //console.log(time);
      listenTimer();
    },1000);
    started = true;
  }
}

function listenTimer() {//时间监听器，1秒执行1次
	if(time == Math.ceil(lightLamp*0.666)+1 && lightBool == true) {//可操作游戏
	}
	// console.log(numComplete,currentLamp);

	if(numComplete == currentLamp) {
		if(currentLamp != 15) {
			alert("恭喜你，成功进入下一关游戏!");
			if(currentLamp == 4)
				window.location.href = "secondDoor.html?4";
			if(currentLamp == 9)
				window.location.href = "thirdDoor.html?13";
		} else {
			alert("恭喜你，全部通关！");
			window.location.href = "addScore.html?28";
		}
	}
}

function listenScore() {//监听分数
	var clickedTime = numComplete;
	interval = setInterval(function() {
		if (clickedTime < numComplete) {
			score += 1;
			scoreDiv.innerHTML = '分数:' + score;
			clickedTime ++;
		}
	},100);
}

function lightLamp() {//游戏开始后的亮灯环节
	var flag = 0;
	var grid = document.getElementsByTagName("td");
	interval = setInterval(function () {
		//0.666秒一次
		flag = lighting(grid,flag);
    },666);
	lightBool = true;
}

function lighting(grid,flag) {
	if(flag < currentLamp) {
		for (var i = 0; i < grid.length; i++) {
			grid[i].children[0].src = "res/lampNo.png";
		}
		grid[randomList[flag]].children[0].src = "res/lampYes.png";
	} else if(flag == currentLamp) {
		for (var i = 0; i < grid.length; i++) {
			grid[i].children[0].src = "res/lampNo.png";
		}
	}
	flag ++;
	return flag;
}