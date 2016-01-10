var app = angular.module('BadmintonFun', []);

var _playersSource = [{ name: "一平", Sex: "男", Power: 60, TotalPlayedCount: 0 },
                        { name: "小瑜", Sex: "女", Power: 99, TotalPlayedCount: 0 },
                        { name: "湘傑", Sex: "男", Power: 98, TotalPlayedCount: 0 },
                        { name: "家弘", Sex: "男", Power: 95, TotalPlayedCount: 0 },
                        { name: "阿蔡", Sex: "男", Power: 95, TotalPlayedCount: 0 },
                        { name: "雅淳", Sex: "女", Power: 99, TotalPlayedCount: 0 },
                        { name: "韓國人", Sex: "男", Power: 98, TotalPlayedCount: 0 },
                        { name: "大白", Sex: "男", Power: 80, TotalPlayedCount: 0 },
                        { name: "阿三哥", Sex: "男", Power: 93, TotalPlayedCount: 0 },
                        { name: "千景", Sex: "男", Power: 97, TotalPlayedCount: 0 },
                        { name: "慈婷", Sex: "女", Power: 90, TotalPlayedCount: 0 }];

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

        var roundList = [];
        if (window.localStorage.getItem("roundList") != "") {
            console.log(window.localStorage.getItem("roundList"));
            roundList = JSON.parse(window.localStorage.getItem("roundList"));
        }

        $scope.attendList = [];
        $scope.roundList = roundList;
        $scope.refreshStatic();
    };

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

    $scope.IsShowSubmit = function () {
        if ($scope.attendList.length >= 4)
            return true;
        else
            return false;
    };

    $scope.AddToRoundList = function (players) {
        if (players == undefined || players.length < 4) {
            alert("尚未完成出賽名單");
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

    $scope.RemoveRound = function (round) {
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

    $scope.refreshStatic = function () {
        var tempRoundList = $scope.roundList;

        //Reload roundlist
        var tempPlayersSourceViewModel = $scope.playerSource;

        var count = 0;
        $.each(tempPlayersSourceViewModel, function (i, itemA) {
            count = 0;
            for (var i = 0; i < tempRoundList.length; i++) {
                for (var j = 0; j < tempRoundList[i].players.length; j++) {
                    if (tempRoundList[i].players[j].name == itemA.name)
                        count += 1;
                }
            }
            itemA.TotalPlayedCount = count;
            //if (roundList != undefined && roundList.length > 0) {
            //    roundList.players.forEach(function (result, index) {
            //        console.log(itemB)
            //        if (itemA.name == itemB.name) {
            //            count++;
            //        }
            //    });
            //    itemA.TotalPlayedCount = count;
            //}
        });

        $scope.playerStatic = tempPlayersSourceViewModel;
    };

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
