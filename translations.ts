export const translations = {
  en: {
    // Header
    myAir: 'My Air',
    english: 'EN',
    hindi: 'HI',
    
    // Location
    location: 'Location:',
    selectCity: 'Select a city...',
    detectLocation: 'Detect',
    currentLocation: 'Current Location',
    detectingLocation: 'Detecting location...',
    
    // AQI
    airQualityIndex: 'Air Quality Index',
    justNow: 'Just now',
    live: 'Live',
    good: 'Good',
    moderate: 'Moderate',
    unhealthy: 'Unhealthy',
    hazardous: 'Hazardous',
    
    // Weather
    temperature: 'Temperature',
    humidity: 'Humidity',
    windSpeed: 'Wind Speed',
    visibility: 'Visibility',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    feelsLike: 'Feels like',
    clear: 'Clear',
    
    // Chart
    aqiTrend: '24-Hour AQI Trend',
    
    // Health Alerts
    healthAlert: {
      good: '🌿 Air is clean, perfect for outdoor activities!',
      moderate: '😊 Air quality is acceptable for most people.',
      unhealthy: '😷 Consider wearing a mask when going outside.',
      hazardous: '⚠️ Avoid outdoor activities. Stay indoors!'
    },
    
    // Tips
    tipOfDay: '💡 Tip of the Day',
    
    // Actions
    shareWhatsApp: 'Share on WhatsApp',
    saveCity: 'Save This City',
    savedCities: 'Saved Cities',
    saved: 'Saved!',
    
    // Mask Reminder
    maskReminder: '😷 Mask Reminder',
    maskMessage: 'Air quality is unhealthy. Consider wearing a mask when going outdoors.',
    gotIt: 'Got it!',
    
    // Loading & Errors
    loading: 'Loading air quality data...',
    error: 'Unable to fetch data. Please try again.',
    locationError: 'Unable to detect location. Please select a city manually.',
    noGeolocation: 'Geolocation is not supported by this browser.',
    
    // Voice
    speechNotSupported: 'Speech synthesis not supported in this browser.',
    
    // WhatsApp Share
    whatsappTemplate: '🌬️ *My Air Report*\n\n📍 {location}\n🔍 AQI: {aqi} ({status})\n🌡️ Temperature: {temperature}\n\n#AirQuality #MyAir'
  },
  
  hi: {
    // Header
    myAir: 'मेरी हवा',
    english: 'EN',
    hindi: 'HI',
    
    // Location
    location: 'स्थान:',
    selectCity: 'एक शहर चुनें...',
    detectLocation: 'खोजें',
    currentLocation: 'वर्तमान स्थान',
    detectingLocation: 'स्थान खोजा जा रहा है...',
    
    // AQI
    airQualityIndex: 'वायु गुणवत्ता सूचकांक',
    justNow: 'अभी',
    live: 'लाइव',
    good: 'अच्छा',
    moderate: 'मध्यम',
    unhealthy: 'अस्वस्थ',
    hazardous: 'खतरनाक',
    
    // Weather
    temperature: 'तापमान',
    humidity: 'आर्द्रता',
    windSpeed: 'हवा की गति',
    visibility: 'दृश्यता',
    sunrise: 'सूर्योदय',
    sunset: 'सूर्यास्त',
    feelsLike: 'महसूस होता है',
    clear: 'साफ',
    
    // Chart
    aqiTrend: '24-घंटे AQI ट्रेंड',
    
    // Health Alerts
    healthAlert: {
      good: '🌿 हवा साफ है, बाहरी गतिविधियों के लिए बेहतरीन!',
      moderate: '😊 अधिकांश लोगों के लिए हवा की गुणवत्ता स्वीकार्य है।',
      unhealthy: '😷 बाहर जाते समय मास्क पहनने पर विचार करें।',
      hazardous: '⚠️ बाहरी गतिविधियों से बचें। घर के अंदर रहें!'
    },
    
    // Tips
    tipOfDay: '💡 आज का सुझाव',
    
    // Actions
    shareWhatsApp: 'WhatsApp पर साझा करें',
    saveCity: 'इस शहर को सेव करें',
    savedCities: 'सेव किए गए शहर',
    saved: 'सेव हो गया!',
    
    // Mask Reminder
    maskReminder: '😷 मास्क रिमाइंडर',
    maskMessage: 'हवा की गुणवत्ता अस्वस्थ है। बाहर जाते समय मास्क पहनने पर विचार करें।',
    gotIt: 'समझ गया!',
    
    // Loading & Errors
    loading: 'वायु गुणवत्ता डेटा लोड हो रहा है...',
    error: 'डेटा लाने में असमर्थ। कृपया पुनः प्रयास करें।',
    locationError: 'स्थान का पता लगाने में असमर्थ। कृपया मैन्युअल रूप से एक शहर चुनें।',
    noGeolocation: 'इस ब्राउज़र द्वारा जियोलोकेशन समर्थित नहीं है।',
    
    // Voice
    speechNotSupported: 'इस ब्राउज़र में स्पीच सिंथेसिस समर्थित नहीं है।',
    
    // WhatsApp Share
    whatsappTemplate: '🌬️ *मेरी हवा रिपोर्ट*\n\n📍 {location}\n🔍 AQI: {aqi} ({status})\n🌡️ तापमान: {temperature}\n\n#AirQuality #MyAir'
  }
};

export type Language = keyof typeof translations;

export const tips = {
  en: [
    "Indoor plants like spider plants, peace lilies, and snake plants can help improve indoor air quality by filtering out common pollutants.",
    "Avoid outdoor exercise during high pollution days. Choose indoor activities instead.",
    "Keep windows closed during high AQI days and use air purifiers if available.",
    "Consider using public transportation or carpooling to reduce air pollution.",
    "Wear N95 masks when AQI levels exceed 100 to protect your respiratory health.",
    "Stay hydrated as it helps your body cope with air pollution effects.",
    "Check air quality before planning outdoor activities, especially for children and elderly.",
    "Consider air-purifying indoor plants like aloe vera, bamboo palm, and rubber tree.",
    "Use HEPA air purifiers in bedrooms for better sleep quality during polluted days.",
    "Avoid burning candles, incense, or wood during high pollution periods to reduce indoor pollution."
  ],
  hi: [
    "स्पाइडर प्लांट, पीस लिली और स्नेक प्लांट जैसे इनडोर पौधे सामान्य प्रदूषकों को फिल्टर करके इनडोर हवा की गुणवत्ता में सुधार कर सकते हैं।",
    "उच्च प्रदूषण के दिनों में बाहरी व्यायाम से बचें। इसके बजाय इनडोर गतिविधियों को चुनें।",
    "उच्च AQI दिनों में खिड़कियों को बंद रखें और यदि उपलब्ध हो तो एयर प्यूरिफायर का उपयोग करें।",
    "वायु प्रदूषण को कम करने के लिए सार्वजनिक परिवहन या कारपूलिंग का उपयोग करने पर विचार करें।",
    "अपने श्वसन स्वास्थ्य की सुरक्षा के लिए AQI स्तर 100 से अधिक होने पर N95 मास्क पहनें।",
    "हाइड्रेटेड रहें क्योंकि यह आपके शरीर को वायु प्रदूषण के प्रभावों से निपटने में मदद करता है।",
    "बाहरी गतिविधियों की योजना बनाने से पहले हवा की गुणवत्ता की जांच करें, विशेष रूप से बच्चों और बुजुर्गों के लिए।",
    "एलोवेरा, बैम्बू पाम और रबर ट्री जैसे हवा शुद्ध करने वाले इनडोर पौधों पर विचार करें।",
    "प्रदूषित दिनों में बेहतर नींद की गुणवत्ता के लिए बेडरूम में HEPA एयर प्यूरिफायर का उपयोग करें।",
    "उच्च प्रदूषण अवधि के दौरान इनडोर प्रदूषण को कम करने के लिए मोमबत्तियां, धूपबत्ती या लकड़ी जलाने से बचें।"
  ]
};
