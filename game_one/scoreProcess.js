//全局变量
var href = window.location.href;
var score = href.split('?')[1];

preProcess();
addScore();

function preProcess() {//预处理分数

	var scoreDiv = document.getElementById('score');
	if (scoreDiv != null) {
		if (score == null) {
			score = 0;
		}
		scoreDiv.innerHTML = '分数:'+score;
	}

	var finalScore = document.getElementById('finalScore');
	if(finalScore != null) {
		finalScore.innerHTML = '你的最终成绩是'+score;
	}

	console.log(href.indexOf('scoreList.html'));

	if(href.indexOf('scoreList.html') != -1) {
		var name = href.split('?')[2];
		if(name != null) {
			addList(name);
		}
		var table = document.getElementById('GridTable');
		handleList(table);
	}
}

function addScore() {
	var button = document.getElementById('submit');
	if(button != null) {
		button.addEventListener("click",function(){
			var name = document.getElementById('name');
			button.href = 'scoreList.html?'+score+'?'+name.value;
	        });
	}
}

function addList(name) {//将昵称分数写入文件
	console.log("进入addList");
	$.ajax({
		type: "get",
		url: "scoreList.json",
		async: true,
		success: function(data) {
			var realdata = eval("("+ data +")");
			console.log(realdata);
			insert(realdata,name);
		}
	});
}

function sco(realdata,name) {
	for(var i = 0; i < realdata.length; i++) {//直插算法
		if(score > parseInt(realdata[i].score)) {
			var partdata = [];
			partdata.name = name;
			partdata.score = score;
			realdata.splice(i,0,partdata);
			break;
		}
		if(i = realdata.length - 1 && score < parseInt(realdata[i].score)) {
			var partdata = {
				"score" : score,
				"name" : name
			}
			realdata.splice(realdata.length,0,partdata);
			break;
		}
	}
	//写入json文件
	var file = new File([realdata], "scoreList1.json", {type: "text;charset=utf-8"});
	saveAs(file);
	console.log(realdata);
}

function handleList(table) {//处理本地json文件和排序
	// console.log("进入ajax");
	$.ajax({
        type: "get",
        url: "scoreList.json", 
        async: true,
        success:function(data){
        	var realdata = eval("("+ data +")");
        	// console.log("运行成功");
        	if(realdata.length == 0) {
        		var div = "<div style='text-align: center;margin-bottom: 80px;position: absolute;left: 400px,top: 300px;font-size: 50px'>暂无排名！</div>";
        		table.innerHTML = div;
        	} else {
        		var tr1 = document.createElement('tr');
        		var th = "<th>排名</th><th>昵称</th><th>分数</th>";
        		tr1.innerHTML = th;
        		table.appendChild(tr1);
        		var loop = realdata.length;
        		if (loop > 10) {
        			loop = 10;
        		}
        		for(var i = 0; i < loop; i++) {
        			var tr = document.createElement('tr');
        			for(var j = 0; j < 3; j++) {
        				var td = document.createElement('td');
        				if(j == 0) {
        					td.innerHTML = i+1;
        				}
        				if(j == 1) {
        					td.innerHTML = realdata[i].name;
        				}
        				if(j == 2) {
        					td.innerHTML = realdata[i].score;
        				}
        				tr.appendChild(td);
        			}
        			table.appendChild(tr);
        		}
            }
        },
        error:function(){
        	console.log("运行失败");
        }
    });
}