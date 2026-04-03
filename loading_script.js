// 로딩 바 기능
const loadingBar = document.getElementById('loading-bar');
const loadingText = document.getElementById('loading-text');

function showLoading() {
    loadingBar.classList.add('active');
    loadingText.classList.add('active');
}

function hideLoading() {
    loadingBar.classList.remove('active');
    loadingText.classList.remove('active');
    loadingBar.style.width = '0%';
}

// 모든 링크에 로딩 효과 추가 (2초 지연)
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && !link.onclick) {
        const href = link.getAttribute('href');
        if (href && (href.startsWith('http') || href.endsWith('.html'))) {
            e.preventDefault(); // 기본 링크 동작 방지
            showLoading();
            loadingBar.style.width = '90%';
            
            // 2초 후 페이지 이동
            setTimeout(() => {
                if (href.startsWith('http')) {
                    window.open(href, '_blank');
                } else {
                    window.location.href = href;
                }
            }, 2000);
        }
    }
});
