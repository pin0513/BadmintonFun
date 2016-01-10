/**
 * @author Paul
 */
var app = angular.module('BadmintonFun', []);

var _playersSource =   [{ name: "一平", Sex: "男", Power: 60, TotalPlayedCount: 0 },
                        { name: "小瑜", Sex: "女", Power: 99, TotalPlayedCount: 0 },
                        { name: "湘傑", Sex: "男", Power: 98, TotalPlayedCount: 0 },
                        { name: "家弘", Sex: "男", Power: 95, TotalPlayedCount: 0 },
                        { name: "雅淳", Sex: "女", Power: 99, TotalPlayedCount: 0 },
                        { name: "大白", Sex: "男", Power: 80, TotalPlayedCount: 0 },
                        { name: "阿三哥", Sex: "男", Power: 93, TotalPlayedCount: 0 },
                        { name: "亮維", Sex: "男", Power: 90, TotalPlayedCount: 0 },
                        { name: "吳醫師", Sex: "男", Power: 90, TotalPlayedCount: 0 },
                        { name: "慈婷", Sex: "女", Power: 90, TotalPlayedCount: 0 },
                        { name: "韓國人", Sex: "男", Power: 98, TotalPlayedCount: 0 },
                        //臨打球員
                        { name: "阿蔡", Sex: "男", Power: 95, TotalPlayedCount: 0 },
                        { name: "小P", Sex: "男", Power: 95, TotalPlayedCount: 0 },
                        { name: "小拍", Sex: "男", Power: 95, TotalPlayedCount: 0 },
                        { name: "千景", Sex: "男", Power: 97, TotalPlayedCount: 0 },
                        { name: "一剛", Sex: "男", Power: 90, TotalPlayedCount: 0 },
                        { name: "辛普森", Sex: "男", Power: 90, TotalPlayedCount: 0 }];

var _objectIdList = {
    playersPool: "#playersPool",
    attendList: "#attendList",
    todayRounds: "#todayRounds",

    attend: "#attendBtn",
    send: "#sendBtn"
};

app.controller('PlayerCtrl', ['$scope', function ($scope) {

    $scope.init = function () {

        $scope.objectIdList = _objectIdList;
        $scope.playerSource = _playersSource;

        $scope.attendList = [];

        var roundList = [];
        if (window.localStorage.getItem("roundList") != "") {
            console.log(window.localStorage.getItem("roundList"));
            roundList = JSON.parse(window.localStorage.getItem("roundList"));
        }

        $scope.roundList = roundList;

        $scope.refreshStatic();
    };

    //新增到出場名單
    $scope.AddToAttendList = function (player) {

        var selectedPlayer = player.name + "(" + player.Sex + ")"

        var repeated = false;
        $.each($scope.attendList, function (i, item) {
            if (item.name == player.name) {
                repeated = true;
            }
        });

        if (repeated) {
            alert("不可新增重覆名單");
            return;
        }

        if ($scope.attendList.length >= 4) {
            alert("一個場只能排4個人");
            //清除
            if (confirm("是否要清除？")) {
                $scope.attendList = [];
            }
        } else {
            $scope.attendList.push(player);
        }
    };

    //移除球員
    $scope.RemovePlayer = function (player) {
        var attendList = $scope.attendList;

        //findAndRemove
        attendList.forEach(function (result, index) {
            if (result["name"] === player.name) {
                //Remove from array
                attendList.splice(index, 1);
            }
        });

        $scope.attendList = attendList;
    };

    //是否要顯示送出上場名單按鈕的判斷
    $scope.IsShowSubmit = function () {
        if ($scope.attendList.length >= 4)
            return true;
        else
            return false;
    };

    //關於作者
    $scope.showAuthor = function () {
        alert("Author:Paul\r\nEmail:pin0513@gmail.com")
    };

    //提出上場名單
    $scope.AddToRoundList = function (players) {
        if (players == undefined || players.length < 4) {
            alert("尚未完成上場名單");
            return;
        }

        var roundList = $scope.roundList;
        if (roundList == undefined)
            roundList = [];

        var newRoundId = roundList.length + 1;
        var round = { "roundId": newRoundId, players: players, "createTime": new Date().getTime() };


        roundList.push(round);

        window.localStorage.setItem("roundList", JSON.stringify(roundList));
        $scope.roundList = roundList;

        $scope.attendList = [];

        // Refresh Static
        $scope.refreshStatic();
        return false;
    };

    //移除場次
    $scope.RemoveRound = function (round) {

        if (confirm("確定要刪除？") == false)
            return;

        var tempRoundList = $scope.roundList;

        //findAndRemove
        tempRoundList.forEach(function (result, index) {
            if (result["roundId"] === round.roundId) {
                //Remove from array
                tempRoundList.splice(index, 1);
            }
        });

        $scope.roundList = tempRoundList;
        window.localStorage.setItem("roundList", JSON.stringify(tempRoundList));

        $scope.refreshStatic();
        return false;
    };

    //更新出賽統計
    $scope.refreshStatic = function () {
        var tempRoundList = $scope.roundList;

        //Reload roundlist
        var tempPlayersSource = $scope.playerSource;

        var count = 0;
        $.each(tempPlayersSource, function (i, itemA) {
            count = 0;
            for (var i = 0; i < tempRoundList.length; i++) {
                for (var j = 0; j < tempRoundList[i].players.length; j++) {
                    if (tempRoundList[i].players[j].name == itemA.name)
                        count += 1;
                }
            }
            itemA.TotalPlayedCount = count;
        });

        $scope.playerSource = tempPlayersSource;
        $scope.playerStatic = tempPlayersSource;
    };

    //判斷是否大於0，用於判斷是否要顯示球員出賽次數的標籤
    $scope.IsMoreThenZero = function (number) {
        if (number > 0)
            return true;
        else {
            return false;
        }
    };

    //清除快取
    $scope.clearcache = function () {
        if (confirm("Sure?"))
            window.localStorage.setItem("roundList", "");
    };
}]);




/**
 * @class Badminton
 * @constructor
 * @return Badminton object
 * @author Paul
 */
var badminton = function () {
    /**
    * @class _object object tool
    * @constructor
    * @return _action object object
    */
    _object = {
        playersPool: "#playersPool",
        attendList: "#attendList",
        todayRounds: "#todayRounds",

        attend: "#attendBtn",
        send: "#sendBtn"
    };

    return {

        /**
        * init
        * @function
        */
        init: function () {
            var _that = this;
            ////註冊事件
            _that.documentEvent();
        },

        /**
        * 註冊事件
        * @function
        */
        documentEvent: function () {
            var _that = this;
            //出賽
            $(document).off("click", _object.attend);
            $(document).on("click", _object.attend, function () {
                var $obj = $(this);

                var selectedPlayer = $(_object.playersPool).find("input[type=radio]:checked").attr("playerName")

                var $selectedAttendPlayers = $(_object.attendList + " .attendPlayer");
                if ($selectedAttendPlayers.length >= 4) {
                    alert("一個場只能排4個人");
                    //清除
                    if (confirm("是否要清除？"))
                        $(_object.attendList).html("");
                } else {
                    $(_object.attendList).append("<li class='attendPlayer'>" + selectedPlayer + "</li>");
                }

                return false;
            });

            //出賽
            $(document).off("click", _object.send);
            $(document).on("click", _object.send, function () {
                var $obj = $(this);
                var $selectedAttendPlayers = $(_object.attendList + " .attendPlayer");
                var roundCount = $(_object.todayRounds + " .round").length + 1;

                if ($selectedAttendPlayers.length == 4) {
                    $(_object.todayRounds).append("<li class='round'>場次:" + roundCount + "<ul>" + $(_object.attendList).html() + "</ul></li>");
                    //清除
                    $(_object.attendList).html("");
                } else {
                    alert("尚未完成出賽名單");
                }
                return false;
            });
        }
    };
};
