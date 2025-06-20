const DAILY_GOALS_KEY = 'petchi_daily_goals';
const LAST_RESET_KEY = 'petchi_last_reset';
const READ_ARTICLES_KEY = 'petchi_read_articles';
const REDDIT_CONFIG = {
    subreddits: ['productivity', 'getmotivated', 'selfimprovement', 'habits', 'timemanagement'],
    limit: 10,
    timeFilter: 'week'
};
const ARTICLE_CACHE_KEY = 'petchi_daily_articles';
const CACHE_DURATION = 24 * 60 * 60 * 1000;

function getTodayDateString() {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
}

function checkAndResetDaily() {
    const today = getTodayDateString();
    const lastReset = localStorage.getItem(LAST_RESET_KEY);
    
    if (lastReset !== today) {
        console.log('🌅 New day detected! Resetting goals...');
        
        const goals = JSON.parse(localStorage.getItem('goals')) || [];
        const resetGoals = goals.map(goal => ({
            ...goal,
            completed: false
        }));
        
        localStorage.setItem('goals', JSON.stringify(resetGoals));
        localStorage.setItem(LAST_RESET_KEY, today);
        localStorage.setItem('currentProgress', JSON.stringify({completed: 0, total: resetGoals.length}));
        
        return true;
    }
    
    return false;
}

function showDailyResetMessage() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #4CAF50;
        color: white;
        padding: 12px 24px;
        border-radius: 25px;
        font-size: 14px;
        font-family: 'Pavanam', sans-serif;
        z-index: 9999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideDown 0.3s ease;
    `;
    notification.innerHTML = '🌅 New day, fresh start! Goals reset for today';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function() {
    preventZoom();
    loadPetData();
    loadGoalsProgress();
    updatePetMood();
    
    document.body.classList.add('homepage-active');
    
    if (!document.getElementById('learningScreen').classList.contains('hidden')) {
        return;
    }
    
    document.getElementById('homeScreen').classList.remove('hidden');
    document.getElementById('learningScreen').classList.add('hidden');
});

function preventZoom() {
    document.addEventListener('gesturestart', function(e) {
        e.preventDefault();
    });
    
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
}

function loadPetData() {
}

function loadGoalsProgress() {
    const wasReset = checkAndResetDaily();
    
    const goals = JSON.parse(localStorage.getItem('goals')) || [];
    const completedGoals = goals.filter(goal => goal.completed).length;
    const totalGoals = goals.length;
    
    updateProgressDisplay(completedGoals, totalGoals);
    displayGoalsList(goals);
    
    if (wasReset && goals.length > 0) {
        showDailyResetMessage();
    }
}

function updateProgressDisplay(completed, total) {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    
    progressFill.style.width = percentage + '%';
    progressText.textContent = `${completed}/${total}`;
    
    localStorage.setItem('currentProgress', JSON.stringify({completed, total}));
}

function updatePetMood() {
    const petSprite = document.getElementById('petSprite');
    const progress = JSON.parse(localStorage.getItem('currentProgress')) || {completed: 0, total: 3};
    
    petSprite.classList.remove('happy', 'sad', 'neutral');
    
    const completionRate = progress.total > 0 ? progress.completed / progress.total : 0;
    
    if (completionRate >= 0.8) {
        petSprite.src = 'imgs/petchi-happy.png';
        petSprite.classList.add('happy');
    } else if (completionRate <= 0.2 && progress.total > 0) {
        petSprite.src = 'imgs/petchi-sad.png';
        petSprite.classList.add('sad');
    } else {
        petSprite.src = 'imgs/petchi-neutral.png';
        petSprite.classList.add('neutral');
    }
}

function displayGoalsList(goals) {
    const goalsList = document.getElementById('goalsList');
    goalsList.innerHTML = '';
    
    const incompleteGoals = goals.filter(goal => !goal.completed);
    
    incompleteGoals.forEach(goal => {
        const goalItem = document.createElement('div');
        goalItem.className = 'goal-item';
        
        goalItem.innerHTML = `
            <p class="goal-text">${goal.text}</p>
            <div class="goal-actions">
                <div class="delete-goal-btn" onclick="deleteGoal(${goal.id})" title="Delete goal">
                    ❌
                </div>
                <div class="goal-checkbox" onclick="toggleGoal(${goal.id})">
                </div>
            </div>
        `;
        
        goalsList.appendChild(goalItem);
    });
}

function deleteGoal(goalId) {
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
    
        let goals = JSON.parse(localStorage.getItem('goals')) || [];
        
        goals = goals.filter(goal => goal.id !== goalId);
        
        localStorage.setItem('goals', JSON.stringify(goals));
        
        loadGoalsProgress();
        updatePetMood();
        
        console.log('🗑️ Goal deleted:', goalId);
}

function toggleGoal(goalId) {
    event.stopPropagation();
    
    if (navigator.vibrate) {
        navigator.vibrate(30);
    }
    
    const goals = JSON.parse(localStorage.getItem('goals')) || [];
    
    const goalIndex = goals.findIndex(goal => goal.id === goalId);
    if (goalIndex !== -1) {
        goals[goalIndex].completed = !goals[goalIndex].completed;
        
        localStorage.setItem('goals', JSON.stringify(goals));
        
        if (goals[goalIndex].completed) {
            const checkbox = event.target;
            checkbox.innerHTML = '<span class="checkmark">✓</span>';
            checkbox.classList.add('completed');
            
            setTimeout(() => {
                loadGoalsProgress();
                updatePetMood();
            }, 300);
        } else {
            loadGoalsProgress();
            updatePetMood();
        }
    }
}

function addNewGoal() {
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
    
    console.log('Adding new goal');
    
    window.location.href = 'add-goal.html';
}

function refreshProgress() {
    loadGoalsProgress();
    updatePetMood();
}

function switchToHome() {
    if (navigator.vibrate) {
        navigator.vibrate(30);
    }
    
    document.getElementById('learningScreen').classList.add('hidden');
    document.getElementById('homeScreen').classList.remove('hidden');
    
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector('.nav-item[onclick="switchToHome()"]').classList.add('active');
    
    loadGoalsProgress();
    updatePetMood();
}

function switchToLearning() {
    if (navigator.vibrate) {
        navigator.vibrate(30);
    }
    
    document.getElementById('homeScreen').classList.add('hidden');
    document.getElementById('learningScreen').classList.remove('hidden');
    
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector('.nav-item[onclick="switchToLearning()"]').classList.add('active');
    
    renderDailyArticles();
}

function getReadArticles() {
    try {
        const readArticles = localStorage.getItem(READ_ARTICLES_KEY);
        return readArticles ? JSON.parse(readArticles) : [];
    } catch (error) {
        console.error('Error loading read articles:', error);
        return [];
    }
}

function markArticleAsRead(articleUrl) {
    try {
        const readArticles = getReadArticles();
        
        if (!readArticles.includes(articleUrl)) {
            readArticles.push(articleUrl);
            localStorage.setItem(READ_ARTICLES_KEY, JSON.stringify(readArticles));
            
            if (navigator.vibrate) {
                navigator.vibrate(20);
            }
            
            console.log('Marked as read:', articleUrl);
        }
    } catch (error) {
        console.error('Error marking article as read:', error);
    }
}

function isArticleRead(articleUrl) {
    const readArticles = getReadArticles();
    return readArticles.includes(articleUrl);
}

function updateArticleReadStatus(articleUrl) {
    const articleCards = document.querySelectorAll('.article-card');
    
    articleCards.forEach(card => {
        const cardUrl = card.getAttribute('data-url');
        if (cardUrl === articleUrl) {
            card.classList.add('article-read');
            
            let checkmark = card.querySelector('.read-checkmark');
            if (!checkmark) {
                checkmark = document.createElement('div');
                checkmark.className = 'read-checkmark';
                checkmark.innerHTML = '✓';
                
                const topSection = card.querySelector('.article-card-header') || card.firstElementChild;
                if (topSection) {
                    topSection.appendChild(checkmark);
                }
            }
            
            checkmark.style.display = 'block';
        }
    });
}

function openArticle(articleUrl) {
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
    
    markArticleAsRead(articleUrl);
    updateArticleReadStatus(articleUrl);
    window.open(articleUrl, '_blank');
}

async function fetchRedditArticles() {
    try {
        const allArticles = [];
        
        // Fetch from multiple subreddits
        for (const subreddit of REDDIT_CONFIG.subreddits) {
            const url = `https://www.reddit.com/r/${subreddit}/top.json?limit=${REDDIT_CONFIG.limit}&t=${REDDIT_CONFIG.timeFilter}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.data && data.data.children) {
                const posts = data.data.children
                    .map(post => post.data)
                    .filter(post => {
                        // Filter for quality posts
                        return (
                            post.score > 50 && 
                            !post.is_self && 
                            post.url && 
                            !post.url.includes('reddit.com') && 
                            post.title.length > 20 &&
                            !post.over_18 // No NSFW content
                        );
                    })
                    .map(post => ({
                        title: post.title,
                        url: post.url,
                        description: post.selftext ? post.selftext.substring(0, 150) + '...' : 'Discover valuable insights and tips.',
                        score: post.score,
                        subreddit: post.subreddit,
                        readTime: Math.floor(Math.random() * 8) + 3 + ' min read', 
                        tag: getTagFromSubreddit(post.subreddit),
                        meta: `👍 ${post.score} upvotes`
                    }));
                
                allArticles.push(...posts);
            }
        }
        
        return allArticles
            .sort((a, b) => b.score - a.score)
            .slice(0, 6); 
            
    } catch (error) {
        console.error('Error fetching Reddit articles:', error);
        return getFallbackArticles();
    }
}

function getTagFromSubreddit(subreddit) {
    const tagMap = {
        'productivity': 'PRODUCTIVITY',
        'getmotivated': 'MOTIVATION',
        'selfimprovement': 'SELF-IMPROVEMENT',
        'habits': 'HABITS',
        'timemanagement': 'TIME MANAGEMENT'
    };
    return tagMap[subreddit] || 'PRODUCTIVITY';
}

// Fallback articles if API fails
function getFallbackArticles() {
    return [
        {
            title: '30 Productivity Hacks That Actually Work in 2025',
            url: 'https://www.simplilearn.com/best-productivity-hacks-to-get-more-done-article',
            description: 'Discover proven productivity strategies to help you work more efficiently and create more free time in your day.',
            tag: 'PRODUCTIVITY',
            readTime: '8 min read',
            meta: '🔥 Trending'
        },
        {
            title: '21 Habits That Will Boost Your Productivity',
            url: 'https://www.productiveblogging.com/productivity-habits/',
            description: 'Learn powerful habits that successful people use to massively increase their productivity and achieve their goals.',
            tag: 'HABITS',
            readTime: '12 min read',
            meta: '📊 Data-driven'
        },
        {
            title: 'Building New and Lasting Habits in 2025',
            url: 'https://agemate.com/en-us/blogs/news/building-new-and-lasting-habits-in-2025',
            description: 'Science-backed techniques to create behaviors that stick, from micro-habits to habit stacking strategies.',
            tag: 'GOAL SETTING',
            readTime: '6 min read',
            meta: '🧠 Science-based'
        }
    ];
}

// Cache management
function getCachedArticles() {
    try {
        const cached = localStorage.getItem(ARTICLE_CACHE_KEY);
        if (cached) {
            const { articles, timestamp } = JSON.parse(cached);
            const now = Date.now();
            
            if (now - timestamp < CACHE_DURATION) {
                return articles;
            }
        }
    } catch (error) {
        console.error('Error reading cached articles:', error);
    }
    return null;
}

function setCachedArticles(articles) {
    try {
        const cacheData = {
            articles: articles,
            timestamp: Date.now()
        };
        localStorage.setItem(ARTICLE_CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
        console.error('Error caching articles:', error);
    }
}

// Main function to get daily articles
async function getDailyArticles() {
    const cachedArticles = getCachedArticles();
    if (cachedArticles && cachedArticles.length > 0) {
        return cachedArticles;
    }
    
    const freshArticles = await fetchRedditArticles();
    setCachedArticles(freshArticles);
    return freshArticles;
}

async function renderDailyArticles() {
    const articlesContainer = document.getElementById('articlesContainer');
    if (!articlesContainer) return;
    
    articlesContainer.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #666;">
            <div style="font-size: 24px; margin-bottom: 10px;">📚</div>
            <div>Loading articles...</div>
        </div>
    `;
    
    try {
        const articles = await getDailyArticles();
        
        articlesContainer.innerHTML = '';
        
        articles.forEach(article => {
            const isRead = isArticleRead(article.url);
            
            const articleCard = document.createElement('div');
            articleCard.className = `article-card ${isRead ? 'article-read' : ''}`;
            articleCard.setAttribute('data-url', article.url);
            articleCard.onclick = () => openArticle(article.url);
            
            articleCard.innerHTML = `
                <div class="article-card-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; position: relative;">
                    <span class="article-tag">${article.tag}</span>
                    <div class="read-checkmark" style="display: ${isRead ? 'block' : 'none'};">✓</div>
                </div>
                <h3 class="article-title">${article.title}</h3>
                <p class="article-description">${article.description}</p>
                <div class="article-meta">
                    <span class="read-time">${article.readTime}</span>
                    <span>${article.meta}</span>
                </div>
            `;
            
            articlesContainer.appendChild(articleCard);
        });
        
        const totalArticles = articles.length;
        const readCount = articles.filter(article => isArticleRead(article.url)).length;
        
        if (readCount > 0) {
            const statsDiv = document.createElement('div');
            statsDiv.style.cssText = 'text-align: center; margin-top: 20px; color: rgba(255,255,255,0.8); font-size: 14px;';
            statsDiv.innerHTML = `📖 You've read ${readCount} of ${totalArticles} articles today`;
            articlesContainer.appendChild(statsDiv);
        }
        
    } catch (error) {
        console.error('Error rendering articles:', error);
    }
}

function refreshArticles() {
    localStorage.removeItem(ARTICLE_CACHE_KEY);
    renderDailyArticles();
}

function clearReadHistory() {
    localStorage.removeItem(READ_ARTICLES_KEY);
    console.log('🗑️ Cleared read history');
    renderDailyArticles();
}

function getReadingStats() {
    const readArticles = getReadArticles();
    return {
        totalRead: readArticles.length,
        readToday: readArticles.length,
        readUrls: readArticles
    };
}

function manualResetGoals() {
    localStorage.removeItem(LAST_RESET_KEY);
    loadGoalsProgress();
    console.log('🔄 Manually triggered daily reset');
}

function getDailyStats() {
    const today = getTodayDateString();
    const lastReset = localStorage.getItem(LAST_RESET_KEY);
    const goals = JSON.parse(localStorage.getItem('goals')) || [];
    const completed = goals.filter(goal => goal.completed).length;
    
    return {
        date: today,
        isToday: lastReset === today,
        totalGoals: goals.length,
        completedGoals: completed,
        completionRate: goals.length > 0 ? Math.round((completed / goals.length) * 100) : 0
    };
}

document.addEventListener('keydown', function(e) {
    if (e.key === '1') switchToHome();
    if (e.key === '2') switchToLearning();
});

window.addEventListener('popstate', function(e) {
    if (!document.getElementById('homeScreen').classList.contains('hidden')) {
        return;
    } else {
        e.preventDefault();
        switchToHome();
    }
});

window.addEventListener('storage', function(e) {
    if (e.key === 'goals') {
        refreshProgress();
    }
});

window.addEventListener('orientationchange', function() {
    setTimeout(function() {
        window.scrollTo(0, 0);
    }, 500);
});

window.petchiApp = {
    refreshProgress: refreshProgress,
    updatePetMood: updatePetMood
};