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

app.factory('DataHelper', ['$window', function (win) {
    return {
        findCourt: function (courtSource, courtId) {
            var court;

            $.each(courtSource, function (i, item) {
                if (item.id == courtId) {
                    court = item;
                    return;
                }
            });

            return court;
        },
        findPlayer: function (playerSource, playerName) {
            var player;
            $.each(playerSource, function (i, item) {
                if (item.name == playerName) {
                    player = item;
                    return;
                }
            });
            return player;
        }
    }
}]);

/**
 * Controller
 */
app.controller('PlayerCtrl', ['$scope', 'Utility', 'DataHelper', function ($scope, Utility, DataHelper) {

    $scope.elements = function () {
        return {
            attend_court: "attend_court",
            round_chk_roundWait: "#round_btn_roundWait",
            round_chk_roundStart: "#round_btn_roundStart",
            round_chk_roundFinish: "#round_btn_roundFinish",
        };
    };

    $scope.init = function () {

        $scope.objectIdList = _objectIdList;
        $scope.playerSource = _playersSource;
        $scope.courtSource = _courtSource;

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

        //確認是否有已選擇的場地
        var selectedCourt = $("input:radio[name=" + $scope.elements().attend_court + "]:checked");
        if (selectedCourt != undefined && selectedCourt.length > 0) {
            var maxplayer = selectedCourt.attr("max-players");
            if (maxplayer != undefined && $scope.attendList.length >= maxplayer) {
                alert("一個場只能排" + maxplayer + "個人");
                //清除
                if (confirm("是否要清除名單，重新排場？")) {
                    $scope.attendList = [];
                }
                return;
            }
        }

        $scope.attendList.push(player);
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

    //是否要顯示場地選項
    $scope.IsShowCourt = function (attendPlayer) {
        if (attendPlayer.length > 0) {
            return true;
        }
        else {
            return false;
        }
    };

    //是否要顯示送出上場名單按鈕的判斷
    $scope.IsShowSubmit = function () {
        var selectedCourt = $("input:radio[name=" + $scope.elements().attend_court + "]:checked");
        if (selectedCourt != undefined && selectedCourt.length > 0) {
            var maxplayer = selectedCourt.attr("max-players");
            if (maxplayer != undefined && $scope.attendList.length == maxplayer)
                return true;
            else
                return false;
        } else
            return false;

    };

    //關於作者
    $scope.showAuthor = function () {
        alert("Author:Paul\r\nEmail:pin0513@gmail.com");
    };

    //提出上場名單
    $scope.AddToRoundList = function (players) {
        var selectedCourt = $("input:radio[name=" + $scope.elements().attend_court + "]:checked");
        if (selectedCourt == undefined || selectedCourt.length == 0) {
            alert("請選擇場地");
            return;
        }

        var maxplayer = selectedCourt.attr("max-players");

        if (players == undefined || players.length < maxplayer) {
            alert("尚未完成上場名單");
            return;
        }

        var roundList = $scope.roundList;
        if (roundList == undefined)
            roundList = [];

        var newRoundId = roundList.length + 1;

        var courtId = selectedCourt.val();
        var court = DataHelper.findCourt($scope.courtSource, courtId);
        var round = { "roundId": newRoundId, players: players, courtName: court.name, "createTime": new Date().getTime(), status: "wait" };


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

    $scope.setRoundStatus = function (round, status) {
        var tempRoundList = $scope.roundList;

        //findAndRemove
        tempRoundList.forEach(function (result, index) {
            if (result["roundId"] === round.roundId) {
                if (result.status == 'finish')
                    if (!confirm("確定要更改狀態？"))
                        return;

                result.status = status;
            }
        });

        Utility.SetCache("roundList", JSON.stringify(tempRoundList));
        $scope.roundList = tempRoundList;

    };

    $scope.SetRoundStatusStyleClass = function (round) {
        if (round.status == 'finish')
            return "btn btn-lg btn-default";
        else if (round.status == 'wait')
            return "btn btn-lg btn-warning";
        else
            return "btn btn-lg btn-success";

    };

    //清除快取
    $scope.clearcache = function () {
        if (confirm("確定要清除?")) {
            Utility.ClearCache("roundList");
            location.reload();
        }
    };
}]);


