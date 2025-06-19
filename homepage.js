document.addEventListener('DOMContentLoaded', function() {
    preventZoom();
    loadPetData();
    loadGoalsProgress();
    updatePetMood();
    
    // Enable scrolling for homepage
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
    const goals = JSON.parse(localStorage.getItem('goals')) || [];
    const completedGoals = goals.filter(goal => goal.completed).length;
    const totalGoals = goals.length;
    
    updateProgressDisplay(completedGoals, totalGoals);
    displayGoalsList(goals);
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
            <div class="goal-checkbox" onclick="toggleGoal(${goal.id})">
                <!-- Empty checkbox since these are all incomplete -->
            </div>
        `;
        
        goalsList.appendChild(goalItem);
    });
}

function toggleGoal(goalId) {
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


// Configuration
const REDDIT_CONFIG = {
    subreddits: ['productivity', 'getmotivated', 'selfimprovement', 'habits', 'timemanagement'],
    limit: 10,
    timeFilter: 'week'
};

const ARTICLE_CACHE_KEY = 'petchi_daily_articles';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Function to fetch articles from Reddit
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
    
    articlesContainer.innerHTML = '<div style="text-align: center; padding: 40px; color: #666;">Loading fresh articles...</div>';
    
    try {
        const articles = await getDailyArticles();
        
        articlesContainer.innerHTML = '';
        
        articles.forEach(article => {
            const articleCard = document.createElement('div');
            articleCard.className = 'article-card';
            articleCard.onclick = () => openArticle(article.url);
            
            articleCard.innerHTML = `
                <span class="article-tag">${article.tag}</span>
                <h3 class="article-title">${article.title}</h3>
                <p class="article-description">${article.description}</p>
                <div class="article-meta">
                    <span class="read-time">${article.readTime}</span>
                    <span>${article.meta}</span>
                </div>
            `;
            
            articlesContainer.appendChild(articleCard);
        });
        
    } catch (error) {
        console.error('Error rendering articles:', error);
        // Show fallback articles
        const fallbackArticles = getFallbackArticles();
        articlesContainer.innerHTML = '';
        
        fallbackArticles.forEach(article => {
            const articleCard = document.createElement('div');
            articleCard.className = 'article-card';
            articleCard.onclick = () => openArticle(article.url);
            
            articleCard.innerHTML = `
                <span class="article-tag">${article.tag}</span>
                <h3 class="article-title">${article.title}</h3>
                <p class="article-description">${article.description}</p>
                <div class="article-meta">
                    <span class="read-time">${article.readTime}</span>
                    <span>${article.meta}</span>
                </div>
            `;
            
            articlesContainer.appendChild(articleCard);
        });
    }
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

function refreshArticles() {
    localStorage.removeItem(ARTICLE_CACHE_KEY);
    renderDailyArticles();
}

function openArticle(url) {
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
    
    window.open(url, '_blank');
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

