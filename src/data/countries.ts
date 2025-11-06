// I maintain a simple country list for the order form
export const countries: string[] = [
  'Sweden', 'Denmark', 'Norway', 'Finland', 'Iceland',
  'United Kingdom', 'Ireland', 'Germany', 'France', 'Spain', 'Portugal', 'Italy', 'Netherlands', 'Belgium', 'Luxembourg', 'Switzerland', 'Austria', 'Poland', 'Czech Republic', 'Slovakia', 'Hungary', 'Slovenia', 'Croatia', 'Bosnia and Herzegovina', 'Serbia', 'Montenegro', 'Kosovo', 'North Macedonia', 'Albania', 'Greece', 'Bulgaria', 'Romania', 'Moldova', 'Ukraine', 'Belarus', 'Lithuania', 'Latvia', 'Estonia',
  'United States', 'Canada', 'Mexico', 'Brazil', 'Argentina', 'Chile', 'Colombia', 'Peru', 'Uruguay', 'Paraguay', 'Ecuador',
  'Australia', 'New Zealand', 'Japan', 'South Korea', 'China', 'India', 'Singapore', 'Malaysia', 'Thailand', 'Vietnam', 'Philippines', 'Indonesia', 'United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Bahrain', 'Kuwait', 'Israel', 'Turkey', 'South Africa', 'Egypt', 'Morocco', 'Tunisia'
];

// I map a few common default calling codes for auto-prefixing
export const countryDialCode: Record<string, string> = {
  'Sweden': '+46', 'Denmark': '+45', 'Norway': '+47', 'Finland': '+358', 'Iceland': '+354',
  'United Kingdom': '+44', 'Ireland': '+353', 'Germany': '+49', 'France': '+33', 'Spain': '+34', 'Portugal': '+351', 'Italy': '+39', 'Netherlands': '+31', 'Belgium': '+32', 'Switzerland': '+41', 'Austria': '+43', 'Poland': '+48',
  'United States': '+1', 'Canada': '+1', 'Mexico': '+52', 'Brazil': '+55', 'Argentina': '+54', 'Chile': '+56', 'Colombia': '+57',
  'Australia': '+61', 'New Zealand': '+64', 'Japan': '+81', 'South Korea': '+82', 'China': '+86', 'India': '+91', 'Singapore': '+65', 'Malaysia': '+60', 'Thailand': '+66', 'Vietnam': '+84', 'Philippines': '+63', 'Indonesia': '+62',
  'United Arab Emirates': '+971', 'Saudi Arabia': '+966', 'Qatar': '+974', 'Bahrain': '+973', 'Kuwait': '+965', 'Israel': '+972', 'Turkey': '+90', 'South Africa': '+27', 'Egypt': '+20', 'Morocco': '+212', 'Tunisia': '+216'
};
