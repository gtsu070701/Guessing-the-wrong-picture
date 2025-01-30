document.addEventListener("DOMContentLoaded", function () {
    // 모든 코드를 여기에 넣습니다.
    const level = {
        image: "images/1.jpg",
        differences: [
            { x: 80, y: 930, radius: 50 },
            { x: 112, y: 779, radius: 50 },
            { x: 48, y: 851, radius: 50 },
            { x: 152, y: 267, radius: 50 },
            { x: 420, y: 348, radius: 50 },
            { x: 432, y: 765, radius: 50 },
            { x: 532, y: 203, radius: 50 },
            { x: 455, y: 612, radius: 50 },
            { x: 511, y: 921, radius: 50 },
            { x: 562, y: 487, radius: 50 },
        ],
        time: 60
    };

    let foundCount = 0;
    let score = 0;
    let timer;
    let remainingTime;
    let foundPoints = [];
    const successSound = document.getElementById("success-sound");

    function startGame() {
        foundCount = 0;
        foundPoints = [];
        remainingTime = level.time;
        document.getElementById("gameImage").src = level.image;
        document.getElementById("found").textContent = "0";
        document.getElementById("total").textContent = level.differences.length;
        document.getElementById("score").textContent = score;
        document.getElementById("message").textContent = "";

        clearInterval(timer);
        removeMarks();
        startTimer();
    }

    function startTimer() {
        document.getElementById("timer").textContent = remainingTime;
        clearInterval(timer);
        timer = setInterval(() => {
            remainingTime--;
            document.getElementById("timer").textContent = remainingTime;
            if (remainingTime <= 0) {
                clearInterval(timer);
                document.getElementById("message").textContent = "⏳ 시간 초과! 다시 시도하세요.";
            }
        }, 1000);
    }

    document.getElementById("gameImage").addEventListener("click", function (event) {
        const rect = this.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        const scaleX = this.naturalWidth / rect.width;
        const scaleY = this.naturalHeight / rect.height;
        const adjustedX = Math.round(clickX * scaleX);
        const adjustedY = Math.round(clickY * scaleY);

        // 클릭한 좌표를 화면에 표시
        document.getElementById("message").textContent = `클릭한 좌표: (${adjustedX}, ${adjustedY})`;

        let correctClick = false;

        for (let diff of level.differences) {
            const dx = adjustedX - diff.x;
            const dy = adjustedY - diff.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // 차이점 정보를 화면에 표시
            const differenceInfo = `차이점: (${diff.x}, ${diff.y}), 거리: ${distance.toFixed(2)}, 반경: ${diff.radius}, 반경 내: ${distance < diff.radius ? "Yes" : "No"}`;
            document.getElementById("message").textContent += `\n${differenceInfo}`;

            if (distance < diff.radius && !foundPoints.includes(diff)) {
                foundPoints.push(diff);
                foundCount++;
                document.getElementById("found").textContent = foundCount;
                score += 10;
                document.getElementById("score").textContent = score;
                correctClick = true;

                markDifference(clickX, clickY, "O");
                if (successSound) successSound.play();

                if (foundCount === level.differences.length) {
                    document.getElementById("message").textContent = "🎉 모든 차이를 찾았습니다!";
                    clearInterval(timer);
                }
                break;
            }
        }

        if (!correctClick) {
            document.getElementById("message").textContent += "\n❌ 틀렸습니다!";
            markDifference(clickX, clickY, "X");

            setTimeout(() => {
                document.getElementById("message").textContent = "";
                removeMarks(); // X 표시만 제거
            }, 1000);
        }
    });

    function markDifference(x, y, mark) {
        const imageContainer = document.getElementById("imageContainer");
        const marker = document.createElement("div");
        marker.textContent = mark;
        marker.style.position = "absolute";
        marker.style.left = `${x - 15}px`;
        marker.style.top = `${y - 15}px`;
        marker.style.width = "30px";
        marker.style.height = "30px";
        marker.style.lineHeight = "30px";
        marker.style.textAlign = "center";
        marker.style.color = mark === "O" ? "white" : "black";
        marker.style.fontSize = "20px";
        marker.style.fontWeight = "bold";
        marker.style.borderRadius = "50%";
        marker.style.backgroundColor = mark === "O" ? "green" : "transparent";
        marker.style.border = mark === "O" ? "2px solid green" : "none";
        marker.style.zIndex = "1000";
        marker.style.pointerEvents = "none";

        // 마커에 클래스 추가
        if (mark === "O") {
            marker.classList.add("marker-correct");
        } else {
            marker.classList.add("marker-incorrect");
        }

        imageContainer.appendChild(marker);
    }

    function removeMarks() {
        const imageContainer = document.getElementById("imageContainer");
        const marks = imageContainer.querySelectorAll(".marker-incorrect"); // X 표시만 선택
        marks.forEach(mark => mark.remove());
    }

    document.getElementById("restart-button").addEventListener("click", function () {
        location.reload(true); // 강제로 페이지 리로드 (캐시 무시)
    });

    startGame();
});