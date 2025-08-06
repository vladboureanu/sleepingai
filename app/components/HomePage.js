'use client';

export default function HomePage({ 
  topics, 
  selectedTopic, 
  setSelectedTopic, 
  visualRotation, 
  setVisualRotation,
  credits,
  onNavigate 
}) {
  const handleTopicSelect = (index) => {
    setSelectedTopic(index);
    setVisualRotation(-index * 72);
  };

  const handlePrevTopic = () => {
    const newTopic = selectedTopic === 0 ? topics.length - 1 : selectedTopic - 1;
    setSelectedTopic(newTopic);
    setVisualRotation(prev => prev - 72); // Left arrow = rotate left (negative)
  };

  const handleNextTopic = () => {
    const newTopic = selectedTopic === topics.length - 1 ? 0 : selectedTopic + 1;
    setSelectedTopic(newTopic);
    setVisualRotation(prev => prev + 72); // Right arrow = rotate right (positive)
  };

  const handleGenerateStory = () => {
    if (credits > 0) {
      onNavigate('generate');
    } else {
      alert('Not enough credits! Please purchase more credits.');
    }
  };

  return (
    <>
      {/* Navigation Arrows - Moved closer to carousel center */}
      <button 
        onClick={handlePrevTopic} 
        className="fixed left-64 top-[55%] transform -translate-y-1/2 z-[100] bg-white bg-opacity-80 hover:bg-opacity-95 rounded-full p-3 shadow-lg transition-all duration-200 backdrop-blur-sm"
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button 
        onClick={handleNextTopic} 
        className="fixed right-64 top-[55%] transform -translate-y-1/2 z-[100] bg-white bg-opacity-80 hover:bg-opacity-95 rounded-full p-3 shadow-lg transition-all duration-200 backdrop-blur-sm"
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Main Content - Completely separate */}
      <div className="flex flex-col items-center justify-center h-full">
        {/* 3D Carousel - No arrows inside */}
        <div className="w-full max-w-6xl mb-3">
          <div className="overflow-visible" style={{ perspective: '1200px' }}>
            <div className="flex items-center justify-center h-72 relative" style={{ transformStyle: 'preserve-3d', transform: `rotateY(${visualRotation}deg)`, transition: 'transform 600ms cubic-bezier(0.4, 0.0, 0.2, 1)' }}>
              {topics.map((topic, index) => {
                const angle = index * 72;
                const currentRotation = visualRotation % 360;
                const normalizedRotation = currentRotation < 0 ? currentRotation + 360 : currentRotation;
                const cardRotation = (angle + normalizedRotation) % 360;
                const isInCenter = Math.abs(cardRotation) < 36 || Math.abs(cardRotation - 360) < 36;
                
                // Update selectedTopic when a card is centered
                if (isInCenter && selectedTopic !== index) {
                  setTimeout(() => setSelectedTopic(index), 0);
                }
                
                return (
                  <div key={topic.id} className="cursor-pointer transition-all duration-600 ease-out absolute" 
                       style={{ transform: `rotateY(${angle}deg) translateZ(250px) scale(${isInCenter ? 1 : 0.85})`, opacity: isInCenter ? 1 : 0.4, zIndex: isInCenter ? 30 : 20, transformStyle: 'preserve-3d' }}
                       onClick={() => handleTopicSelect(index)}>
                    <div className={`relative rounded-3xl overflow-hidden w-80 h-48 ${isInCenter ? 'shadow-2xl' : 'shadow-lg'}`}>
                      <img src={`/images/${topic.image}`} alt={topic.title} className="w-full h-full object-cover" style={{ display: 'block' }} />
                      <div className={`absolute inset-0 transition-all duration-600 ${isInCenter ? 'bg-black bg-opacity-5' : 'bg-black bg-opacity-40'}`}></div>
                      {isInCenter && <div className="absolute inset-0 border-2 border-white border-opacity-20 rounded-3xl pointer-events-none"></div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Topic Info */}
        <div className="text-center mb-2 px-4">
          <h3 className="text-xl md:text-2xl font-medium text-gray-700 mb-1">{topics[selectedTopic].title}</h3>
          <p className="text-lg text-gray-700 max-w-xl mx-auto leading-relaxed font-normal opacity-90">{topics[selectedTopic].description}</p>
        </div>

        {/* Dots */}
        <div className="flex justify-center mb-3 gap-2">
          {topics.map((_, index) => (
            <button key={index} onClick={() => handleTopicSelect(index)} 
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === selectedTopic ? 'bg-purple-600 scale-125' : 'bg-gray-600 hover:bg-gray-500 opacity-80'}`} />
          ))}
        </div>

        {/* Generate Button */}
        <button onClick={handleGenerateStory} disabled={credits === 0}
                className={`py-4 px-8 rounded-full font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105 transition-all duration-300 ease-out disabled:transform-none disabled:cursor-not-allowed ${
                  credits > 0 ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white' : 'bg-gray-300 text-gray-600'}`}>
          {credits > 0 ? 'Generate Story' : 'No Credits Available'}
        </button>
      </div>
    </>
  );
}