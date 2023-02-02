let questnum = $('.question').length
var count = 0;
var activeItem = $('.item.active');
var currID;
/// count1 Array for correct answers in all questions
var count1 = []
for (let i = 0; i < $(".question").length; i++) {
    count1.push($(`.question_${i + 1}`).find(`.option[data-Answer="correct"]`).length)
}
var count2 = []
for (let i = 0; i < $(".question").length; i++) {
    count2.push($(`.question_${i + 1}`).find(`.option[data-Answer="incorrect"]`).length)
}
/// countcorr Array for correct answers the user click in every question
var countcorr = [];
var countwrong = [];

for (let i = 0; i < $(".question").length; i++) {
    countcorr.push(0)
}
for (let i = 0; i < $(".question").length; i++) {
    countwrong.push(0)
}

function fnTemplate1_v2(_div) {
    /// Append Circles
    for (let i = 0; i < $(".question").length; i++) {
        var circles = `
        <div class="circle circle_${i + 1}">${i + 1}</div>
        `;
        $(".circles").append(circles);
    }

    /////////////////////////// Check Button Display Function ///////////////////////////////////////////////////////
    function checkButtonEnable(activeItem) {
        var score = 0;
        activeItem.find('.question').each(function () {
            var $this = $(this);
            $this.find('.option', $(this)).each(function () {
                /// condition to stay disabled after going through slides
                if ($(this).hasClass("clicked") && $(this).hasClass("prevent_click")) {
                    $('.check_btn').addClass('prevent_click');
                } else if ($(this).hasClass("clicked")) {
                    score++
                    if (score >= activeItem.find(".question").length) {
                        $(".check_btn").removeClass("prevent_click");
                    }
                    return false;
                }
                /// condition to be disabled after answer
                else {
                    $('.check_btn').addClass('prevent_click');
                }
            });
        });
    }

    ////////////////////////// Timer Function ////////////////////////////////////////////////////////
    let hr = 0
    let min = 0
    let sec = 40

    let hours = hr * 3600000
    let minutes = min * 60000
    let seconds = sec * 1000
    let setTime = hours + minutes + seconds
    let startTime = Date.now();
    let futureTime = startTime + setTime
    let timerLoop = setInterval(countDownTimer)


    function countDownTimer() {
        let currentTime = Date.now();
        let remainingTime = futureTime - currentTime;
        let angle = (remainingTime / setTime) * 360;

        /// progress Indicator

        if (angle > 180) {
            $(`.white-circle`).css('display', 'none');
            $(`.red-circle`).css('transform', `rotate(180deg)`);
            $(`.blue-circle`).css('transform', `rotate(${angle}deg)`);
        }
        else {
            $(`.white-circle`).css('display', 'block');
            $(`.red-circle`).css('transform', `rotate(${angle}deg)`);
            $(`.blue-circle`).css('transform', `rotate(${angle}deg)`);
        }

        /// Timer
        let hrs = Math.floor((remainingTime / (1000 * 60 * 60)) % 24).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
        let mins = Math.floor((remainingTime / (1000 * 60)) % 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
        let secs = Math.floor((remainingTime / 1000) % 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });

        $(".timer").html(`
        <div>${hrs}</div> 
        <div class="colon">:</div> 
        <div>${mins}</div> 
        <div class="colon">:</div> 
        <div>${secs}</div> 
        `)

        /// 5-Sec Condition
        if (remainingTime <= 6000) {
            $(`.red-circle`).css('background-color', 'red');
            $(`.blue-circle`).css('background-color', 'red');
            $(".timer").css('color', 'red');

        }

        /// End Section
        if (remainingTime < 0) {
            clearInterval(timerLoop);
            $(`.white-circle`).css({ 'display': 'none', 'transform': 'none' });
            $(`.red-circle`).css({ 'display': 'none', 'transform': 'none' });
            $(`.blue-circle`).css({ 'display': 'none', 'transform': 'none' });

            $(".timer").html(`
            <div>00</div> 
            <div class="colon">:</div> 
            <div>00</div> 
            <div class="colon">:</div> 
            <div>00</div> 
            `)
            $(".timer").css('color', '#ddd');
            $('.check_btn').addClass('prevent_click');
            $(".option").addClass("prevent_click");
            $('.question').each(function () {
                checkAnswer($(this));
            });
            setTimeout(() => {
                scoreRender();
            }, 2000);
        }
    }


    function resetTimer() {
        clearInterval(timerLoop);
        hr = 0
        min = 0
        sec = 40
        hours = hr * 3600000
        minutes = min * 60000
        seconds = sec * 1000
        setTime = hours + minutes + seconds
        startTime = Date.now();
        futureTime = startTime + setTime
        timerLoop = setInterval(countDownTimer)
        $(".timer").css('color', '#088b8b');
        $(`.white-circle`).css('display', 'none');
        $(`.red-circle`).css({ 'display': 'block', 'transform': `rotate(180deg)`, 'background-color': '#088b8b' });
        $(`.blue-circle`).css({ 'display': 'block', 'transform': `rotate(360deg)`, 'background-color': '#088b8b' });
    }

    ////////////////////////// Answering options Function //////////////////////////////////////////////////
    $('.option').on('click', function () {
        var result = $(this).attr("data-Answer");
        var currDiv = $(this).closest(".options");
        currID = $(this).closest(".question").attr("id") - 1
        if ($(this).hasClass('clicked')) {
            $(this).removeClass("clicked");
            $(this).find('input[type=checkbox]').prop('checked', false);
            if ($(this).hasClass('selectall')) {
                currDiv.find(".individual").children('input[type=checkbox]').prop("checked", $(this).children('input[type=checkbox]').prop("checked"));
                currDiv.find(".individual").removeClass("clicked");
                countcorr[currID] = 0;
                countwrong[currID] = 0;
            }
            /// to handle multiple clicks on the same option
            if (result == "correct" && !$(this).hasClass('selectall')) {
                countcorr[currID]--;
            } else if (result == "incorrect" && !$(this).hasClass('selectall')) {
                countwrong[currID]--;
            }
        } else {
            $(this).addClass("clicked");
            console.log("jhkjh");
            /// to prevent default value of false
            $(this).find('input[type=checkbox]').prop('checked', true);
            if ($(this).hasClass('selectall')) {
                currDiv.find(".individual").children('input[type=checkbox]').prop("checked", $(this).children('input[type=checkbox]').prop("checked"));
                currDiv.find(".individual").addClass("clicked");
                countcorr[currID] = count1[currID]
                countwrong[currID] = count2[currID]
            }
            /// check answer and increase counter if correct
            if (result == "correct" && !$(this).hasClass('selectall')) {
                countcorr[currID] += 1;
            } else if (result == "incorrect" && !$(this).hasClass('selectall')) {
                countwrong[currID]++;
            }
        }
        checkButtonEnable(activeItem);
    });
    ////////////////////////// Check Button on click Function ///////////////////////////////////////////////////////

    function checkAnswer(ele) {
        var $this = ele;
        var counterID = $this.attr("id") - 1
        var circlenum = counterID + 1

        /// Loop over all options individually
        $this.find('.option', $(this)).each(function () {
            var that = $(this)
            var result = $(this).attr("data-Answer");
            /// check clicked options
            if (that.hasClass("clicked")) {
                /// if the data answer of this option is incorrect && no correct Answer was clicked 
                if (result === "incorrect") {
                    that.closest(".question").addClass("completed");
                    that.addClass("incorrect");
                    activeItem.find(`[data-Answer='correct']`).addClass("correct");
                    $(`.circle_${circlenum}`).css('background-color', 'red');
                }
                /// if the data answer of this option is correct 
                else if (result === "correct") {
                    that.addClass("correct");
                    /// if number of clicked correct answers = number of correct answers in question
                    if (countcorr[counterID] == count1[counterID] && countwrong[counterID] == 0) {
                        that.closest(".question").addClass("completed Correct");
                        $(`.circle_${circlenum}`).css('background-color', 'green');
                    } else {
                        that.closest(".question").addClass("completed");
                        activeItem.find(`[data-Answer='${result}']`).not(".clicked").addClass("correct");
                        $(`.circle_${circlenum}`).css('background-color', 'red');
                    }
                }
            }

        });

        if (!$this.hasClass("completed")) {
            $this.find(`[data-Answer='correct']`).addClass("correct");
            $(`.circle_${circlenum}`).css('background-color', 'red');
        }
    }

    $('.check_btn').on('click', function () {
        $('.check_btn').addClass('prevent_click');
        activeItem.find(".option").addClass("prevent_click");

        activeItem.find('.question').each(function () {
            checkAnswer($(this));
        });

        /////////////////////////////////////////////////////////////////////////////////

        if (activeItem.find(".Correct").length == activeItem.find('.question').length) {
            playSound('./assets/audio/correct-answer.wav');
        } else {
            playSound('./assets/audio/wrong-answer.wav');
        }

        if ($(".completed").length == $('.question').length) {
            scoreRender();
            clearInterval(timerLoop);
        }

    });

    /////////////////////////////////// score render  //////////////////////////////////////////////////
    function scoreRender() {
        var score = $(".Correct").length
        $(`#scoreContainer`).css('display', 'flex')
        // calculate the amount of question percent answered by the user
        const scorePerCent = Math.round(100 * score / $('.question').length);

        // choose the image based on the scorePerCent
        let img = (scorePerCent >= 80) ? "./assets/images/5.png" :
            (scorePerCent >= 60) ? "./assets/images/4.png" :
                (scorePerCent >= 40) ? "./assets/images/3.png" :
                    (scorePerCent >= 20) ? "./assets/images/2.png" :
                        "./assets/images/1.png";

        $(`#scoreContainer`).html(`
    <div class="center1">
    <img src="${img}" class="resultImg">
    <br>
    <p>${scorePerCent}%</p>
    </div> 
    `)
  setTimeout(() => {
}, 2000);
}
$(`#scoreContainer`).css('display', 'none')
$(`#scoreContainer`).html('')

    ////////////////////////// Next Button Function ////////////////////////////////////////////////////////
    $('#next_screen').on('click', function () {
        activeItem = $('.item.active').next();
        checkButtonEnable(activeItem);
    });

    ////////////////////////// Previous Button Function ////////////////////////////////////////////////////
    $('#prev_screen').on('click', function () {
        activeItem = $('.item.active').prev();
        checkButtonEnable(activeItem);
    });

    ////////////////////////// Reaload Button Function /////////////////////////////////////////////////////
    $('.reload_btn').on('click', function () {
        activeItem = $('.item').first();
        count = 0;
        countcorr = [];
        countwrong = [];
        for (let i = 0; i < $(".question").length; i++) {
            countcorr.push(0)
        }
        for (let i = 0; i < $(".question").length; i++) {
            countwrong.push(0)
        }
        $(`#scoreContainer`).css('display', 'none')
        $('.option').removeClass("prevent_click1 prevent_click clicked correct incorrect").find('input[type=checkbox]').prop('checked', false);
        $('.question').removeClass("Correct completed");
        $(".pagination_wrapper").removeClass("prevent_click1");
        $('.check_btn').addClass('prevent_click');
        $(`.circle`).css('background-color', 'transparent');
        resetTimer();
    });
    ////////////////////////////////////////////////////////////////////////////////////////////////////////

    checkButtonEnable(activeItem);
    countDownTimer();

}