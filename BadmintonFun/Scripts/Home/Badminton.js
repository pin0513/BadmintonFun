/**
 * @author Paul
 */
var app = angular.module('BadmintonFun', [])

/**
 * Service，抽出來跨Controller共用
 */
app.factory('Utility', ['$window', function (win) {
    return {
        SetCache: function (key, value) {
            win.localStorage.setItem(key, value);
        },
        GetCache: function (key) {
            win.localStorage.getItem(key);
        },
        ClearCache: function (key) {
            win.localStorage.setItem(key, "");
        }
    }
}]);

/**
 * Controller
 */
app.controller('PlayerCtrl', ['$scope', 'Utility', function ($scope, Utility) {

    $scope.init = function () {

        $scope.objectIdList = _objectIdList;
        $scope.playerSource = _playersSource;

        $scope.attendList = [];

        var roundList = [];
        if (Utility.GetCache("roundList") != "") {
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

        Utility.SetCache("roundList", JSON.stringify(roundList));
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
        Utility.SetCache("roundList", JSON.stringify(tempRoundList));

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
            Utility.ClearCache("roundList");
    };
}]);


