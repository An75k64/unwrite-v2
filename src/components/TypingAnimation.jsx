// Typing Animation Component - ONLY "WRITE"
function TypingBadge() {
    const word = "WRITE"; // Only one word
    const [currentText, setCurrentText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [showCursor, setShowCursor] = useState(true);

    useEffect(() => {
        const typingSpeed = isDeleting ? 80 : 120;
        const pauseTime = 2000;

        const timeout = setTimeout(() => {
            if (!isDeleting) {
                // Typing forward
                if (currentText.length < word.length) {
                    setCurrentText(word.slice(0, currentText.length + 1));
                } else {
                    // Pause before deleting
                    setTimeout(() => setIsDeleting(true), pauseTime);
                }
            } else {
                // Deleting backward
                if (currentText.length > 0) {
                    setCurrentText(word.slice(0, currentText.length - 1));
                } else {
                    // Start typing again
                    setIsDeleting(false);
                }
            }
        }, typingSpeed);

        return () => clearTimeout(timeout);
    }, [currentText, isDeleting]);

    // Cursor blink effect
    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setShowCursor((prev) => !prev);
        }, 500);

        return () => clearInterval(cursorInterval);
    }, []);

    return (
        <span className="inline-flex items-center">
            <span className="text-white/80">UN</span>
            <span className="text-white/80">{currentText}</span>
            <span
                className={`text-white/80 ${
                    showCursor ? "opacity-100" : "opacity-0"
                } transition-opacity duration-100`}
            >
                _
            </span>
            
        </span>
    );
}
