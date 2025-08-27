// Danh sách ảnh và câu chuyện
const memories = [
    {
        image: "/img/img_kb.png",
        title: "Ngày đặc biệt",
        story: "Ngày đó, chúng ta bắt đầu câu chuyện…"
    },
    {
        image: "/img/1.png",
        title: "Tin nhắn đầu tiên",
        story: "Từ những điều nhỏ bé…"
    },
    {
         image: "/img/2.png",
        title: "",
        story: "Chúng ta viết nên câu chuyện của riêng mình."
    },
    {
        image: "/img/3.jpg",
        title: "Lần đầu tiên anh nhìn thấy ảnh em",
        story: "Nụ cười ấy làm mọi thứ trở nên thật đặc biệt."
    },
    {
        image: "/img/4.jpg",
        title: "Nơi đây chúng ta gặp nhau lần đầu",
        story: "Lần đầu nhìn thấy nhau, trao nhau ánh mắt dịu dàng, nụ cười ấm áp. Bữa ăn nhỏ nhưng đầy tiếng cười và những câu chuyện chưa kể."
    },
    {
        image: "/img/5.jpg",
        title: "Cảm ơn vì đã ở lại bên cạnh",
        story: ""
    },
    {
        image: "/img/6.jpg",
        title: "Cảm ơn vì đã ở lại bên cạnh",
        story: ""
    },
    {
        image: "/img/7.jpg",
        title: "Cảm ơn vì đã ở lại bên cạnh",
        story: ""
    },
    {
        image: "/img/8.jpg",
        title: "Người khiến anh luôn muốn bảo vệ",
        story: "Một cô bé dễ thương"
    },
    {
        image: "/img/11.jpg",
        title: "Người khiến anh luôn muốn bảo vệ",
        story: "Lương thiện và tốt bụng"
    },
     {
        image: "/img/12.jpg",
        title: "Người khiến anh luôn muốn bảo vệ",
        story: "Xinh đẹp và đáng yêu"
    },
    {
        image: "/img/10.jpg",
        title: "Người khiến anh luôn muốn bảo vệ",
        story: "Có chút hậu đậu và ngốc nghếch"
    },
    {
        image: "/img/13.jpg",
        title: "Kỷ niệm này sẽ mãi trong tim",
        story: "Dù khó khăn mình vẫn cùng nhau vượt qua. Lần em lên Hà Nội mình chỉ kịp hẹn nhau trong chốc lát nhưng những ký ức đó sẽ mãi không phai."
    },
    {
        image: "/img/9.jpg",
        title: "Một năm kỷ niệm, hành trình vẫn tiếp tục...",
        story: "Một năm có rất nhiều điều không thể nào diễn tả hết bằng lời mà chỉ có thể khắc ghi ở trong tim. Cảm ơn em vì đã đến bên anh."
    }
];

// Elements
const mainImage = document.getElementById('mainImage');
const mainImageContainer = document.getElementById('mainImageContainer');
const storyTitle = document.getElementById('storyTitle');
const storyText = document.getElementById('storyText');
const gallery = document.getElementById('gallery');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const toggleBtn = document.getElementById('toggleBtn');
const musicControl = document.getElementById('musicControl');
const bgMusic = document.getElementById('bgMusic');
const preloader = document.querySelector('.preloader');
const container = document.querySelector('.container');
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const closeModal = document.getElementById('closeModal');

let currentIndex = 0;
let autoPlay = true;
let autoPlayInterval;
let textAnimationInterval;
let textAnimationTimeout;
let isTextAnimating = false;
let imagesLoaded = 0;

// Khởi tạo
function init() {
    preloadImages(() => {
        // Ẩn preloader và hiện nội dung
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
            container.style.opacity = '1';
        }, 500);

        createGallery();
        startAutoPlay();
        createHearts();
        setupSwipe();

        // Cho phép âm thanh tự động phát khi người dùng tương tác
        document.body.addEventListener('click', function () {
            if (bgMusic.paused) {
                bgMusic.play().catch(e => console.log("Autoplay prevented: ", e));
                musicControl.innerHTML = '<i class="fas fa-volume-up"></i>';
            }
        }, { once: true });
    });
}

// Preload images
function preloadImages(callback) {
    const totalImages = memories.length;

    memories.forEach((memory, index) => {
        const img = new Image();
        img.onload = () => {
            imagesLoaded++;
            if (imagesLoaded === totalImages) {
                callback();
            }
        };
        img.onerror = () => {
            console.error(`Failed to load image: ${memory.image}`);
            imagesLoaded++;
            if (imagesLoaded === totalImages) {
                callback();
            }
        };
        img.src = memory.image;
    });
}

// Tạo gallery
function createGallery() {
    memories.forEach((memory, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        if (index === 0) galleryItem.classList.add('active');

        const img = document.createElement('img');
        img.src = memory.image;
        img.alt = memory.title;
        img.className = 'gallery-img';

        galleryItem.appendChild(img);
        galleryItem.addEventListener('click', () => showMemory(index));

        gallery.appendChild(galleryItem);
    });

    // Hiển thị memory đầu tiên
    showMemory(0);
}

// Hiển thị kỷ niệm được chọn
function showMemory(index) {
    currentIndex = index;
    const memory = memories[index];

    // Thêm hiệu ứng fade
    mainImage.classList.remove('fade-in');
    void mainImage.offsetWidth; // Trigger reflow
    mainImage.classList.add('fade-in');

    // Cập nhật ảnh và câu chuyện
    mainImage.src = memory.image;
    storyTitle.textContent = memory.title;

    // Dừng animation hiện tại nếu có
    if (textAnimationInterval) {
        clearInterval(textAnimationInterval);
    }
    if (textAnimationTimeout) {
        clearTimeout(textAnimationTimeout);
    }

    // Xóa nội dung cũ
    storyText.innerHTML = '';

    // Bắt đầu animation chữ mới
    animateText(memory.story);

    // Cập nhật trạng thái active trong gallery
    document.querySelectorAll('.gallery-item').forEach((item, i) => {
        if (i === index) {
            item.classList.add('active');
            // Tự động scroll đến ảnh được chọn
            item.scrollIntoView({ behavior: 'smooth', inline: 'center' });
        } else {
            item.classList.remove('active');
        }
    });

}

// Hiện nguyên đoạn chữ, không hiệu ứng từng từ
function animateText(text) {
    isTextAnimating = false;
    storyText.innerHTML = `<div>${text}</div>`;

    // Tự động chuyển sang memory tiếp theo sau 6s (hoặc tùy chỉnh)
    textAnimationTimeout = setTimeout(() => {
        if (autoPlay) {
            nextMemory();
        }
    }, 5000);
}


// Chuyển đến memory tiếp theo
function nextMemory() {
    currentIndex = (currentIndex + 1) % memories.length;
    showMemory(currentIndex);
}

// Tự động chuyển ảnh
function startAutoPlay() {
    if (autoPlayInterval) clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(() => {
        // Chỉ chuyển ảnh nếu không đang hiệu ứng chữ
            nextMemory();
    }, 5000); // Tăng thời gian lên để đủ xem hiệu ứng chữ
    toggleBtn.innerHTML = '<i class="fas fa-pause"></i><span>Dừng</span>';
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
    toggleBtn.innerHTML = '<i class="fas fa-play"></i><span>Tự động</span>';
}

// Tạo hiệu ứng trái tim
function createHearts() {
    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = (Math.random() * 15 + 15) + 'px';
        heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
        document.body.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 7000);
    }, 1000);
}

// Xử lý sự kiện swipe
function setupSwipe() {
    let startX = 0;
    let endX = 0;

    mainImageContainer.addEventListener('touchstart', (e) => {
        startX = e.changedTouches[0].screenX;
    }, false);

    mainImageContainer.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].screenX;
        handleSwipe(startX, endX);
    }, false);
}

function handleSwipe(startX, endX) {
    if (startX > endX + 50) {
        // Swipe trái - next
        nextMemory();
    } else if (startX < endX - 50) {
        // Swipe phải - previous
        currentIndex = (currentIndex - 1 + memories.length) % memories.length;
        showMemory(currentIndex);
    }

    if (autoPlay) {
        stopAutoPlay();
        autoPlay = false;
    }
}

// Xử lý sự kiện nút
prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + memories.length) % memories.length;
    showMemory(currentIndex);

    if (autoPlay) {
        stopAutoPlay();
        autoPlay = false;
    }
});

nextBtn.addEventListener('click', () => {
    nextMemory();

    if (autoPlay) {
        stopAutoPlay();
        autoPlay = false;
    }
});

toggleBtn.addEventListener('click', () => {
    autoPlay = !autoPlay;
    if (autoPlay) {
        startAutoPlay();
    } else {
        stopAutoPlay();
    }
});

musicControl.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.play();
        musicControl.innerHTML = '<i class="fas fa-volume-up"></i>';
    } else {
        bgMusic.pause();
        musicControl.innerHTML = '<i class="fas fa-music"></i>';
    }
});

// Khởi tạo
init();

// Ngăn zoom bằng hai ngón tay
document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
});
