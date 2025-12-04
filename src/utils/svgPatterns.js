export function generateSvgBackground(category) {
    const colors = {
        yellow: '#F9D342',
        orange: '#F7941D',
        blue: '#3FA9F5',
        teal: '#2CA089',
        greenBg: '#E5F5EC',
    };

    let svg = '';

    switch (category) {
        case 'Tool':
            svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><defs><pattern id="p" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M15,5 Q22,15 15,25 Q8,15 15,5 Z" fill="${colors.teal}" /></pattern></defs><rect width="100" height="100" fill="url(#p)" /></svg>`;
            break;
        case 'Guidance':
            svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><defs><pattern id="p" width="30" height="15" patternUnits="userSpaceOnUse"><path d="M0,7.5 Q7.5,0 15,7.5 T30,7.5" fill="none" stroke="${colors.blue}" stroke-width="3" /></pattern></defs><rect width="100" height="100" fill="url(#p)" /></svg>`;
            break;
        case 'Programme':
            svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><defs><pattern id="p" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="6" fill="${colors.orange}" /></pattern></defs><rect width="100" height="100" fill="url(#p)" /></svg>`;
            break;
        case 'Platform':
            svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><defs><pattern id="p" width="30" height="30" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="12" height="30" fill="${colors.yellow}" /></pattern></defs><rect width="100" height="100" fill="url(#p)" /></svg>`;
            break;
        default:
            svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="${colors.greenBg}" /></svg>`;
    }
    return `data:image/svg+xml;base64,${btoa(svg)}`;
}