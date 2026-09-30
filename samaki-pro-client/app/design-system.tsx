import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAppTheme, ThemeMode, Language } from '~/theme';
import {
    SourceTag,
    StatusBadge,
    SyncBar,
    OfflineBanner,
    ThemeToggle,
    PageHeader,
    MetricCard,
    NumberStepper,
    AlertItem,
    EmptyState,
    ListRow,
    DataTable,
    TrendChart,
    MapPanel,
    Button,
    GlassCard,
    Input,
    Switch,
    SegmentedControl,
    TabBar,
    TabKey,
} from '~/components/ui';

export default function DesignSystemScreen() {
    const router = useRouter();
    const { 
        mode, 
        setMode, 
        colors, 
        typography, 
        radii, 
        spacing, 
        language, 
        setLanguage, 
        isSunMode 
    } = useAppTheme();

    const isSw = language === 'sw';

    // Interactive Demo States
    const [oxygenValue, setOxygenValue] = useState(6.1);
    const [feedValue, setFeedValue] = useState(42.0);
    const [switchSms, setSwitchSms] = useState(true);
    const [switchLowData, setSwitchLowData] = useState(false);
    const [switchFocus, setSwitchFocus] = useState(true);
    const [activeTab, setActiveTab] = useState<TabKey>('cages');
    const [syncStateIndex, setSyncStateIndex] = useState<number>(1);
    const [segmentVal, setSegmentVal] = useState('cages');
    const [isBtnLoading, setIsBtnLoading] = useState(false);
    const [critAck, setCritAck] = useState(false);
    const [watchAck, setWatchAck] = useState(false);

    const syncStates: Array<'synced' | 'waiting' | 'sending' | 'offline' | 'error'> = [
        'waiting', 'sending', 'synced', 'offline', 'error'
    ];

    const ColorBlock = ({ name, color, textColor = '#fff', ratio }: { name: string, color: string, textColor?: string, ratio?: string }) => (
        <View style={[styles.colorBlock, { backgroundColor: color, borderColor: isSunMode ? colors.borderStrong : colors.border }]}>
            <Text style={{ color: textColor, fontWeight: '700', fontSize: 13 }} numberOfLines={1}>{name}</Text>
            <Text style={{ color: textColor, fontSize: 11, opacity: 0.85 }}>{color}</Text>
            {ratio && <Text style={{ color: textColor, fontSize: 10, fontWeight: '700', marginTop: 2 }}>{ratio}</Text>}
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.surfacePage }}>
            <ScrollView contentContainerStyle={[styles.container, { padding: spacing.space4, paddingBottom: 100 }]}>
                
                {/* Top Control Bar */}
                <View style={styles.topControlBar}>
                    <TouchableOpacity 
                        onPress={() => router.push('/(erp)/dashboard')} 
                        style={[styles.backBtn, { borderColor: colors.border, backgroundColor: colors.surfaceCard, borderRadius: radii.md }]}
                    >
                        <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 13 }}>
                            ← {isSw ? 'Rudi ERP' : 'Back to ERP'}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.controlsRow}>
                        {/* Language Switcher */}
                        <TouchableOpacity
                            onPress={() => setLanguage(language === 'en' ? 'sw' : 'en')}
                            style={[
                                styles.pillControl, 
                                { 
                                    backgroundColor: colors.surfaceCard,
                                    borderColor: colors.border,
                                    borderRadius: radii.pill,
                                    marginRight: spacing.space2,
                                }
                            ]}
                        >
                            <Text style={{ color: colors.ink, fontWeight: '700', fontSize: 12 }}>
                                {language === 'en' ? '🇺🇸 English' : '🇹🇿 Kiswahili'}
                            </Text>
                        </TouchableOpacity>

                        {/* Theme Toggle segmented */}
                        <View style={{ width: 170 }}>
                            <ThemeToggle variant="segmented" />
                        </View>
                    </View>
                </View>

                {/* Hero Title */}
                <View style={{ marginVertical: spacing.space4 }}>
                    <Text style={[styles.heroBadge, { color: colors.primary }]}>
                        {isSw ? 'MFUMO WA SANIFU WA SAMAKICASH PRO' : 'SAMAKICASH PRO DESIGN SYSTEM'}
                    </Text>
                    <Text style={[styles.heroTitle, { color: colors.ink, fontSize: typography.display.fontSize }]}>
                        {isSw ? 'Miongozo ya Muundo na Vipengele' : 'Design Tokens & UI Component Spec'}
                    </Text>
                    <Text style={[styles.heroSub, { color: colors.inkMuted, fontSize: typography.body.fontSize }]}>
                        {isSw 
                            ? 'Imeboreshwa kwa wavuvi na wakulima wa vizimba Ziwa Victoria: Hali ya Jua (Sun Mode), Lugha mbili (EN/SW), Uimara Nje ya Mtandao, na Vyanzo vya Data (Provenance).'
                            : 'Engineered for Lake Victoria aquaculture & fisheries: Sun Mode for outdoor glare, bilingual-first English/Swahili, offline-first resilience, and strict data provenance.'}
                    </Text>
                </View>

                {/* Section 1: Colors & Foundations */}
                <Text style={[styles.sectionHeading, { color: colors.ink }]}>1. Color Tokens & High-Contrast Palettes</Text>
                <Text style={[styles.sectionSub, { color: colors.inkMuted }]}>
                    Active theme: <Text style={{ fontWeight: '700', color: colors.primary }}>{mode.toUpperCase()}</Text>. ground & ink, then primary, then state colors, then provenance.
                </Text>

                <Text style={[styles.subGroupHeading, { color: colors.ink }]}>Ground & Surfaces</Text>
                <View style={styles.colorGrid}>
                    <ColorBlock name="surface-page" color={colors.surfacePage} textColor={colors.ink} />
                    <ColorBlock name="surface-card" color={colors.surfaceCard} textColor={colors.ink} />
                    <ColorBlock name="surface-sunken" color={colors.surfaceSunken} textColor={colors.ink} />
                </View>

                <Text style={[styles.subGroupHeading, { color: colors.ink }]}>Ink & Borders</Text>
                <View style={styles.colorGrid}>
                    <ColorBlock name="ink" color={colors.ink} textColor={colors.surfacePage} ratio="17.7:1" />
                    <ColorBlock name="ink-muted" color={colors.inkMuted} textColor={colors.surfacePage} ratio="7.4:1" />
                    <ColorBlock name="border" color={colors.border} textColor={colors.ink} />
                    <ColorBlock name="border-strong" color={colors.borderStrong} textColor={colors.surfacePage} />
                </View>

                <Text style={[styles.subGroupHeading, { color: colors.ink }]}>Brand (Lake Green & Lake Blue)</Text>
                <View style={styles.colorGrid}>
                    <ColorBlock name="primary" color={colors.primary} textColor={colors.onPrimary} />
                    <ColorBlock name="primary-wash" color={colors.primaryWash} textColor={colors.primary} />
                    <ColorBlock name="tint (Lake Blue)" color={colors.tint} textColor="#0b1410" />
                </View>

                <Text style={[styles.subGroupHeading, { color: colors.ink }]}>Semantic States (Text / Fill / Wash)</Text>
                <View style={styles.colorGrid}>
                    <ColorBlock name="ok" color={colors.ok} textColor="#ffffff" />
                    <ColorBlock name="ok-fill" color={colors.okFill} textColor="#ffffff" />
                    <ColorBlock name="ok-wash" color={colors.okWash} textColor={colors.ok} />

                    <ColorBlock name="watch" color={colors.watch} textColor="#ffffff" />
                    <ColorBlock name="watch-fill" color={colors.watchFill} textColor="#ffffff" />
                    <ColorBlock name="watch-wash" color={colors.watchWash} textColor={colors.watch} />

                    <ColorBlock name="critical" color={colors.critical} textColor="#ffffff" />
                    <ColorBlock name="critical-fill" color={colors.criticalFill} textColor="#ffffff" />
                    <ColorBlock name="critical-wash" color={colors.criticalWash} textColor={colors.critical} />

                    <ColorBlock name="note" color={colors.note} textColor="#ffffff" />
                    <ColorBlock name="note-fill" color={colors.noteFill} textColor="#ffffff" />
                    <ColorBlock name="note-wash" color={colors.noteWash} textColor={colors.note} />
                </View>

                <Text style={[styles.subGroupHeading, { color: colors.ink }]}>Provenance Data Sources</Text>
                <View style={styles.colorGrid}>
                    <ColorBlock name="src-manual" color={colors.srcManual} textColor={colors.surfacePage} />
                    <ColorBlock name="src-sensor" color={colors.srcSensor} textColor={colors.onPrimary} />
                    <ColorBlock name="src-satellite" color={colors.srcSatellite} textColor="#ffffff" />
                </View>

                <View style={[styles.divider, { backgroundColor: colors.border }]} />

                {/* Section 2: Typography */}
                <Text style={[styles.sectionHeading, { color: colors.ink }]}>2. Typography (Inter / System Sans)</Text>
                <View style={[styles.cardWrapper, { backgroundColor: colors.surfaceCard, borderColor: colors.border, borderRadius: radii.md }]}>
                    <Text style={{ fontSize: typography.display.fontSize, fontWeight: typography.display.fontWeight, color: colors.ink, marginBottom: 8 }}>
                        Display (32/36 Bold)
                    </Text>
                    <Text style={{ fontSize: typography.title.fontSize, fontWeight: typography.title.fontWeight, color: colors.ink, marginBottom: 8 }}>
                        Title (24/30 Bold) - Lake Victoria Aquaculture
                    </Text>
                    <Text style={{ fontSize: typography.heading.fontSize, fontWeight: typography.heading.fontWeight, color: colors.ink, marginBottom: 8 }}>
                        Heading (20/26 Semibold) - Kirumba Fish Auction
                    </Text>
                    <Text style={{ fontSize: typography.subhead.fontSize, fontWeight: typography.subhead.fontWeight, color: colors.ink, marginBottom: 8 }}>
                        Subhead (16/22 Semibold) - Dissolved Oxygen Sensors
                    </Text>
                    <Text style={{ fontSize: typography.body.fontSize, color: colors.ink, marginBottom: 8 }}>
                        Body (16/24 Regular) - Say the answer, then the number. Water quality in Cage B2 is stable.
                    </Text>
                    <Text style={{ fontSize: typography.label.fontSize, fontWeight: typography.label.fontWeight, color: colors.inkMuted, marginBottom: 8 }}>
                        LABEL (14/20 Semibold) - CAGE INVENTORY
                    </Text>
                    <Text style={{ fontSize: typography.caption.fontSize, color: colors.inkMuted }}>
                        Caption (12/16 Medium) - Last synced 5 minutes ago from Igombe sensor buoy.
                    </Text>
                </View>

                <View style={[styles.divider, { backgroundColor: colors.border }]} />

                {/* Section 3: Live UI Components */}
                <Text style={[styles.sectionHeading, { color: colors.ink }]}>3. Complete UI Component Suite</Text>

                {/* 3.1 Page Header */}
                <Text style={[styles.componentTitle, { color: colors.ink }]}>PageHeader & Location Chips</Text>
                <PageHeader 
                    title="Dashboard" 
                    subtitle="Mwanza Gulf water quality"
                    locationChip="Mwanza Gulf"
                    categoryChip="Cages"
                    unreadAlertsCount={2}
                />

                {/* 3.2 SyncBar */}
                <Text style={[styles.componentTitle, { color: colors.ink, marginTop: spacing.space4 }]}>SyncBar (Live Offline Queue Status)</Text>
                <SyncBar 
                    state={syncStates[syncStateIndex]} 
                    count={3} 
                    time="14:32"
                    onAction={() => setSyncStateIndex((syncStateIndex + 1) % syncStates.length)}
                />
                <Text style={{ fontSize: 12, color: colors.inkMuted, marginTop: 4 }}>
                    Tap 'Send now' / 'Try again' to cycle sync state demo (Current: {syncStates[syncStateIndex]}).
                </Text>

                {/* 3.3 OfflineBanner */}
                <Text style={[styles.componentTitle, { color: colors.ink, marginTop: spacing.space4 }]}>OfflineBanner</Text>
                <OfflineBanner isOnline={false} pendingCount={3} style={{ marginBottom: 8 }} />
                <OfflineBanner isOnline={true} pendingCount={3} />

                {/* 3.4 MetricCard & StatCard */}
                <Text style={[styles.componentTitle, { color: colors.ink, marginTop: spacing.space4 }]}>MetricCard & StatCard</Text>
                <View style={styles.metricRow}>
                    <MetricCard 
                        label={isSw ? 'Oksijeni' : 'Oxygen'}
                        value={oxygenValue.toFixed(1)}
                        unit="mg/L"
                        status="watch"
                        source="sensor"
                        sourceTimestamp="14:32"
                    />
                    <MetricCard 
                        label={isSw ? 'Joto la Maji' : 'Water temp'}
                        value="27.4"
                        unit="°C"
                        status="ok"
                        source="sensor"
                        sourceTimestamp="14:30"
                    />
                </View>
                <View style={[styles.metricRow, { marginTop: spacing.space3 }]}>
                    <MetricCard 
                        label={isSw ? 'Mapato ya Mwezi' : 'Revenue this month'}
                        value="8,300,000"
                        currencyPrefix="TZS"
                        trend={{ direction: 'up', percent: 8, comparisonText: isSw ? 'ikilinganishwa na mwezi uliopita' : 'from last month' }}
                        source="demo"
                    />
                    <MetricCard 
                        label={isSw ? 'Uchafu wa Maji' : 'Turbidity'}
                        value="—"
                        status="no-reading"
                        source="demo"
                    />
                </View>

                {/* 3.5 NumberStepper */}
                <Text style={[styles.componentTitle, { color: colors.ink, marginTop: spacing.space4 }]}>NumberStepper (Touch Field Inputs)</Text>
                <NumberStepper 
                    label={isSw ? 'Oksijeni Iliyoyeyuka' : 'Dissolved oxygen'}
                    value={oxygenValue}
                    unit="mg/L"
                    step={0.1}
                    decimals={1}
                    onChange={setOxygenValue}
                    style={{ marginBottom: 12 }}
                />
                <NumberStepper 
                    label={isSw ? 'Chakula Kilichotolewa' : 'Feed given today'}
                    value={feedValue}
                    unit="kg"
                    step={1.0}
                    decimals={1}
                    onChange={setFeedValue}
                />

                {/* 3.6 AlertItem */}
                <Text style={[styles.componentTitle, { color: colors.ink, marginTop: spacing.space4 }]}>AlertItem (Operational Alerts)</Text>
                <AlertItem 
                    status="critical"
                    title={isSw ? 'Oksijeni imepungua karibu na Kizimba B2' : 'Dissolved oxygen is low near Cage B2'}
                    description={isSw ? '3.8 mg/L, -1.4 mg/L katika saa 2 zilizopita. Sitisha ulishaji hadi oksijeni irejee juu ya 5.0 mg/L.' : '3.8 mg/L, -1.4 mg/L in last 2 hours. Pause feeding until oxygen recovers above 5.0 mg/L.'}
                    source="sensor"
                    sourceTimestamp="5 min ago"
                    onAcknowledge={() => setCritAck(true)}
                    isAcknowledged={critAck}
                />
                <AlertItem 
                    status="watch"
                    title={isSw ? 'Joto la maji linapanda katika Kizimba A1' : 'Water temperature is rising in Cage A1'}
                    description={isSw ? '29.1 °C, ongezeko la 1.6 °C tangu 06:00.' : '29.1 °C, up 1.6 °C since 06:00.'}
                    source="sensor"
                    sourceTimestamp="2 h ago"
                    onAcknowledge={() => setWatchAck(true)}
                    isAcknowledged={watchAck}
                />
                <AlertItem 
                    status="note"
                    title={isSw ? 'Ripoti ya uvunaji imetumwa' : 'Daily catch report submitted'}
                    description={isSw ? 'Eneo la Kirumba, kilo 128 zimerekodiwa.' : 'Kirumba landing site, 128 kg recorded.'}
                    source="manual"
                    sourceTimestamp="Yesterday, 18:30"
                />

                {/* 3.7 StatusBadge & SourceTag */}
                <Text style={[styles.componentTitle, { color: colors.ink, marginTop: spacing.space4 }]}>StatusBadges & SourceTags</Text>
                <View style={[styles.badgeWrap, { marginBottom: 12 }]}>
                    <StatusBadge status="ok" />
                    <StatusBadge status="watch" />
                    <StatusBadge status="critical" />
                    <StatusBadge status="note" />
                    <StatusBadge status="no-reading" />
                </View>
                <View style={styles.badgeWrap}>
                    <SourceTag source="manual" timestamp="14:32" />
                    <SourceTag source="sensor" timestamp="14:30" />
                    <SourceTag source="satellite" timestamp="2 days ago" />
                    <SourceTag source="demo" />
                </View>

                {/* 3.8 DataTable */}
                <Text style={[styles.componentTitle, { color: colors.ink, marginTop: spacing.space4 }]}>DataTable (B2B Marketplace & Catch Monitoring)</Text>
                <DataTable />

                {/* 3.9 ListRow */}
                <Text style={[styles.componentTitle, { color: colors.ink, marginTop: spacing.space4 }]}>ListRow (Cage & Commodity Rows)</Text>
                <ListRow 
                    title="Cage A1"
                    subtitle="27.4 °C · 6.1 mg/L"
                    status="ok"
                    onPress={() => {}}
                />
                <ListRow 
                    title="Cage B2"
                    subtitle="27.9 °C · 5.2 mg/L"
                    status="watch"
                    onPress={() => {}}
                />
                <ListRow 
                    title="Cage C3"
                    subtitle="No sensor report since Sunday"
                    status="no-reading"
                    onPress={() => {}}
                />
                <ListRow 
                    title="Nile perch"
                    subtitle="Kirumba · 28 Sep"
                    rightValue="TZS 8,300/kg"
                    onPress={() => {}}
                />

                {/* 3.10 TrendChart */}
                <Text style={[styles.componentTitle, { color: colors.ink, marginTop: spacing.space4 }]}>TrendChart (24h Sensor Trend with Gap Detection)</Text>
                <TrendChart />

                {/* 3.11 MapPanel */}
                <Text style={[styles.componentTitle, { color: colors.ink, marginTop: spacing.space4 }]}>MapPanel (Offline Lake Victoria Caching)</Text>
                <MapPanel savedTime="14:32" />

                {/* 3.12 EmptyState */}
                <Text style={[styles.componentTitle, { color: colors.ink, marginTop: spacing.space4 }]}>EmptyState</Text>
                <EmptyState 
                    title={isSw ? 'Hakuna vipimo bado' : 'No readings yet'}
                    description={isSw ? 'Rekodi kipimo cha kwanza cha Kizimba A1.' : 'Record the first reading for Cage A1.'}
                    actionLabel={isSw ? 'Rekodi kipimo' : 'Record reading'}
                    onAction={() => {}}
                />

                {/* 3.13 Button */}
                <Text style={[styles.componentTitle, { color: colors.ink, marginTop: spacing.space4 }]}>Buttons (Touch Targets & Variants)</Text>
                <Button 
                    variant="primary" 
                    size="lg" 
                    fullWidth 
                    icon="plus"
                    onPress={() => {
                        setIsBtnLoading(true);
                        setTimeout(() => setIsBtnLoading(false), 2000);
                    }}
                    loading={isBtnLoading}
                >
                    {isSw ? 'Rekodi kipimo' : 'Record reading'}
                </Button>
                <View style={[styles.btnRow, { marginTop: spacing.space2 }]}>
                    <Button variant="primary" size="md">{isSw ? 'Hifadhi' : 'Save'}</Button>
                    <Button variant="secondary" size="md">{isSw ? 'Ghairi' : 'Cancel'}</Button>
                    <Button variant="destructive" size="md">{isSw ? 'Futa' : 'Delete'}</Button>
                    <Button variant="ghost" size="md">{isSw ? 'Maelezo' : 'Details'}</Button>
                </View>

                {/* 3.14 Form Controls */}
                <Text style={[styles.componentTitle, { color: colors.ink, marginTop: spacing.space4 }]}>Form Controls (Input, Switch, SegmentedControl)</Text>
                <Input 
                    label={isSw ? 'Jina la Kizimba' : 'Cage Identifier'}
                    placeholder="e.g. Cage B2"
                    defaultValue="Cage B2"
                    helperText={isSw ? 'Tambulisho rasmi la kitengo cha majini' : 'Official aquaculture unit code'}
                />
                <Input 
                    label={isSw ? 'Tahadhari ya Kosa' : 'Validated Field'}
                    defaultValue="invalid_val"
                    errorMessage={isSw ? 'Kiwango cha oksijeni hakiko sahihi' : 'Invalid sensor threshold format'}
                />
                
                <SegmentedControl 
                    options={[
                        { value: 'cages', label: isSw ? 'Vizimba' : 'Cages' },
                        { value: 'vessels', label: isSw ? 'Meli' : 'Vessels' },
                        { value: 'sensors', label: isSw ? 'Vihisi' : 'Sensors' },
                    ]}
                    selectedValue={segmentVal}
                    onSelect={setSegmentVal}
                    style={{ marginVertical: 8 }}
                />

                <Switch 
                    label={isSw ? 'Tahadhari za SMS' : 'SMS alerts'} 
                    sublabel={isSw ? 'Pokea ujumbe mfupi oksijeni ikishuka' : 'Receive instant SMS when DO is low'}
                    value={switchSms} 
                    onValueChange={setSwitchSms} 
                />
                <Switch 
                    label={isSw ? 'Hali ya Data Ndogo' : 'Low-data mode'} 
                    sublabel={isSw ? 'Punguza matumizi ya mtandao ziwani' : 'Optimize payload when offshore on lake'}
                    value={switchLowData} 
                    onValueChange={setSwitchLowData} 
                />
                <Switch 
                    label={isSw ? 'Hali ya Kuzingatia' : 'Focus mode'} 
                    value={switchFocus} 
                    onValueChange={setSwitchFocus} 
                />

                {/* 3.15 TabBar */}
                <Text style={[styles.componentTitle, { color: colors.ink, marginTop: spacing.space4 }]}>TabBar (Bottom Navigation Bar)</Text>
                <TabBar 
                    activeTab={activeTab} 
                    onTabPress={setActiveTab} 
                    alertsCount={2}
                    style={{ borderRadius: radii.md, overflow: 'hidden' }}
                />

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {},
    topControlBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 8,
    },
    backBtn: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
    },
    controlsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pillControl: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
    },
    heroBadge: {
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 1,
        marginBottom: 6,
    },
    heroTitle: {
        fontWeight: '900',
        letterSpacing: -0.5,
        marginBottom: 8,
    },
    heroSub: {
        lineHeight: 22,
    },
    sectionHeading: {
        fontSize: 20,
        fontWeight: '800',
        marginTop: 20,
        marginBottom: 4,
    },
    sectionSub: {
        fontSize: 13,
        marginBottom: 12,
    },
    subGroupHeading: {
        fontSize: 14,
        fontWeight: '700',
        marginTop: 10,
        marginBottom: 8,
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12,
    },
    colorBlock: {
        width: 105,
        height: 80,
        borderRadius: 8,
        padding: 8,
        justifyContent: 'flex-end',
        borderWidth: 1,
    },
    divider: {
        height: 1,
        marginVertical: 24,
    },
    cardWrapper: {
        padding: 16,
        borderWidth: 1,
    },
    componentTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 8,
    },
    metricRow: {
        flexDirection: 'row',
        gap: 12,
    },
    badgeWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        alignItems: 'center',
    },
    btnRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    }
});
