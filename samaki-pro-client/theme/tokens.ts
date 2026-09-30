export type ThemeMode = 'light' | 'night' | 'sun';
export type Language = 'en' | 'sw';

export interface ColorTokens {
    tint: string;
    scrim: string;
    
    // Surface
    surfacePage: string;
    surfaceCard: string;
    surfaceSunken: string;

    // Ink
    ink: string;
    inkMuted: string;

    // Border
    border: string;
    borderStrong: string;

    // Primary
    primary: string;
    primaryWash: string;
    onPrimary: string;
    onTint: string;

    // Semantic States (text, fill, wash)
    ok: string;
    okFill: string;
    okWash: string;

    watch: string;
    watchFill: string;
    watchWash: string;

    critical: string;
    criticalFill: string;
    criticalWash: string;

    note: string;
    noteFill: string;
    noteWash: string;

    // Connectivity & Offline
    offlineBg: string;
    offlineInk: string;

    // Focus
    focusRing: string;

    // Provenance (SourceTag)
    srcManual: string;
    srcSensor: string;
    srcSatellite: string;

    // Charts
    chart1: string;
    chart2: string;
    chart3: string;
    chart4: string;
    chart5: string;
}

export const themeColors: Record<ThemeMode, ColorTokens> = {
    light: {
        tint: '#54aad1',
        scrim: 'rgba(11, 20, 16, 0.55)',
        surfacePage: '#f7f9f8',
        surfaceCard: '#ffffff',
        surfaceSunken: '#edf2ef',
        ink: '#0b1410',
        inkMuted: '#43504a',
        border: '#dce5e0',
        borderStrong: '#728279',
        primary: '#05583a',
        primaryWash: '#e2f1ea',
        onPrimary: '#ffffff',
        onTint: '#0b1410',
        ok: '#0f612c',
        okFill: '#25984d',
        okWash: '#e3f4e9',
        watch: '#724400',
        watchFill: '#e99b2a',
        watchWash: '#fdf0d8',
        critical: '#a6000d',
        criticalFill: '#e40014',
        criticalWash: '#fde4e6',
        note: '#00558a',
        noteFill: '#0089cb',
        noteWash: '#e1f1fa',
        offlineBg: '#edf2ef',
        offlineInk: '#0b1410',
        focusRing: '#05583a',
        srcManual: '#0b1410',
        srcSensor: '#05583a',
        srcSatellite: '#4b3aa0',
        chart1: '#05583a',
        chart2: '#0089cb',
        chart3: '#4b3aa0',
        chart4: '#b87400',
        chart5: '#6b7a72',
    },
    night: {
        tint: '#54aad1',
        scrim: 'rgba(0, 0, 0, 0.65)',
        surfacePage: '#0b100e',
        surfaceCard: '#151c19',
        surfaceSunken: '#0f1512',
        ink: '#f1f6f3',
        inkMuted: '#a9b7b0',
        border: '#26332d',
        borderStrong: '#5f7268',
        primary: '#5fd09b',
        primaryWash: '#12261d',
        onPrimary: '#06120c',
        onTint: '#06121a',
        ok: '#5fd08a',
        okFill: '#25984d',
        okWash: '#0f2a1a',
        watch: '#f2b84b',
        watchFill: '#e99b2a',
        watchWash: '#33260a',
        critical: '#ff8a8f',
        criticalFill: '#e40014',
        criticalWash: '#3a1215',
        note: '#6cc3f0',
        noteFill: '#0089cb',
        noteWash: '#0f2532',
        offlineBg: '#1b2420',
        offlineInk: '#f1f6f3',
        focusRing: '#5fd09b',
        srcManual: '#f1f6f3',
        srcSensor: '#5fd09b',
        srcSatellite: '#b9a6ff',
        chart1: '#5fd09b',
        chart2: '#6cc3f0',
        chart3: '#b9a6ff',
        chart4: '#f2b84b',
        chart5: '#a9b7b0',
    },
    sun: {
        tint: '#54aad1',
        scrim: 'rgba(11, 20, 16, 0.55)',
        surfacePage: '#ffffff',
        surfaceCard: '#ffffff',
        surfaceSunken: '#f0f0f0',
        ink: '#000000',
        inkMuted: '#1f1f1f',
        border: '#6b6b6b',
        borderStrong: '#000000',
        primary: '#033724',
        primaryWash: '#f0f0f0',
        onPrimary: '#ffffff',
        onTint: '#0b1410',
        ok: '#093c1b',
        okFill: '#25984d',
        okWash: '#f0f0f0',
        watch: '#472a00',
        watchFill: '#e99b2a',
        watchWash: '#f0f0f0',
        critical: '#670008',
        criticalFill: '#e40014',
        criticalWash: '#f0f0f0',
        note: '#003556',
        noteFill: '#0089cb',
        noteWash: '#f0f0f0',
        offlineBg: '#f0f0f0',
        offlineInk: '#000000',
        focusRing: '#033724',
        srcManual: '#000000',
        srcSensor: '#033724',
        srcSatellite: '#2f2463',
        chart1: '#033724',
        chart2: '#00557e',
        chart3: '#2f2463',
        chart4: '#724800',
        chart5: '#6b7a72',
    }
};

export const spacing = {
    space1: 4,
    space2: 8,
    space3: 12,
    space4: 16,
    space5: 20,
    space6: 24,
    space8: 32,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
} as const;

export const radii = {
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    pill: 999,
} as const;

export const sizes = {
    touchMin: 48,
    touchPrimary: 56,
    tabBarHeight: 64,
    iconSm: 20,
    iconMd: 24,
    iconLg: 32,
    strokeControl: 1.5,
    strokeFocus: 3,
    strokeSun: 2,
} as const;

export const shadows = {
    light: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 4,
    },
    night: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
        elevation: 8,
    },
    sun: {
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    }
};

export const typography = {
    display: { fontSize: 32, lineHeight: 36, letterSpacing: -0.64, fontWeight: '700' as const },
    title: { fontSize: 24, lineHeight: 30, letterSpacing: -0.24, fontWeight: '700' as const },
    heading: { fontSize: 20, lineHeight: 26, letterSpacing: 0, fontWeight: '600' as const },
    subhead: { fontSize: 16, lineHeight: 22, letterSpacing: 0, fontWeight: '600' as const },
    body: { fontSize: 16, lineHeight: 24, letterSpacing: 0, fontWeight: '400' as const },
    bodyStrong: { fontSize: 16, lineHeight: 24, letterSpacing: 0, fontWeight: '600' as const },
    label: { fontSize: 14, lineHeight: 20, letterSpacing: 0, fontWeight: '600' as const },
    caption: { fontSize: 12, lineHeight: 16, letterSpacing: 0.12, fontWeight: '500' as const },
    figureHero: { fontSize: 36, lineHeight: 40, letterSpacing: -0.72, fontWeight: '700' as const },
    figure: { fontSize: 24, lineHeight: 30, letterSpacing: -0.24, fontWeight: '700' as const },
    figureSm: { fontSize: 16, lineHeight: 22, letterSpacing: 0, fontWeight: '600' as const },
    mono: { fontSize: 13, lineHeight: 18, letterSpacing: 0, fontWeight: '500' as const },
} as const;

// Bilingual localization strings
export const dictionary = {
    en: {
        // Statuses
        statusOk: 'OK',
        statusWatch: 'Watch',
        statusCritical: 'Critical',
        statusNote: 'Note',
        statusNoReading: 'No reading',
        
        // Sources
        sourceManual: 'Manual',
        sourceSensor: 'Sensor',
        sourceSatellite: 'Satellite',
        sourceDemo: 'Demo data',
        
        // Actions
        recordReading: 'Record reading',
        typeValue: 'Type a value',
        pairSensor: 'Pair a sensor',
        acknowledge: 'Acknowledge',
        sendNow: 'Send now',
        tryAgain: 'Try again',
        save: 'Save',
        cancel: 'Cancel',
        details: 'Details',
        deleteRecord: 'Delete record',
        sending: 'Sending...',
        
        // Sync & Connectivity
        synced: 'Synced',
        waitingToSend: 'Waiting to send',
        waiting: 'Waiting',
        offline: 'Offline',
        couldNotSend: 'Could not send',
        youAreOffline: 'You are offline',
        offlineNotice: 'Everything you enter is kept on this phone and sent when there is signal.',
        backOnline: 'Back online',
        sendingRecords: (n: number) => `Sending ${n} records.`,
        savedOffline: (n: number) => `${n} saved`,
        
        // Navigation Tabs
        navHome: 'Home',
        navLake: 'Lake',
        navCages: 'Cages',
        navAlerts: 'Alerts',
        navMore: 'More',

        // Theme
        themeLight: 'Light',
        themeNight: 'Night',
        themeSun: 'Sun',

        // Empty states
        noReadingsYet: 'No readings yet',
        noReadingsSub: (cage: string) => `Record the first reading for ${cage}.`,
        demoDataNotice: 'Prices shown are sample data.',
    },
    sw: {
        // Statuses
        statusOk: 'Salama',
        statusWatch: 'Angalia',
        statusCritical: 'Hatari',
        statusNote: 'Kumbuka',
        statusNoReading: 'Hakuna kipimo',
        
        // Sources
        sourceManual: 'Mkono',
        sourceSensor: 'Kihisi',
        sourceSatellite: 'Setilaiti',
        sourceDemo: 'Data ya majaribio',
        
        // Actions
        recordReading: 'Rekodi kipimo',
        typeValue: 'Andika thamani',
        pairSensor: 'Unganisha kihisi',
        acknowledge: 'Thibitisha',
        sendNow: 'Tuma sasa',
        tryAgain: 'Jaribu tena',
        save: 'Hifadhi',
        cancel: 'Ghairi',
        details: 'Maelezo',
        deleteRecord: 'Futa rekodi',
        sending: 'Inatuma...',
        
        // Sync & Connectivity
        synced: 'Imelandanishwa',
        waitingToSend: 'Inasubiri kutuma',
        waiting: 'Inasubiri',
        offline: 'Nje ya mtandao',
        couldNotSend: 'Haikuweza kutumwa',
        youAreOffline: 'Uko nje ya mtandao',
        offlineNotice: 'Kila unachoingiza kinahifadhiwa kwenye simu na kitatumwa mtandao ukipatikana.',
        backOnline: 'Mtandao umerudi',
        sendingRecords: (n: number) => `Inatuma kumbukumbu ${n}.`,
        savedOffline: (n: number) => `${n} zimehifadhiwa`,
        
        // Navigation Tabs
        navHome: 'Mwanzo',
        navLake: 'Ziwa',
        navCages: 'Vizimba',
        navAlerts: 'Tahadhari',
        navMore: 'Zaidi',

        // Theme
        themeLight: 'Mwanga',
        themeNight: 'Usiku',
        themeSun: 'Jua Kali',

        // Empty states
        noReadingsYet: 'Hakuna vipimo bado',
        noReadingsSub: (cage: string) => `Rekodi kipimo cha kwanza cha ${cage}.`,
        demoDataNotice: 'Bei zinazoonyeshwa ni mifano tu.',
    }
};
