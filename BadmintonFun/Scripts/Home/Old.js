

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