import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useAppTheme } from '~/theme';

interface MapPanelProps {
    savedTime?: string;
    style?: any;
}

export const MapPanel: React.FC<MapPanelProps> = ({
    savedTime = '14:32',
    style
}) => {
    const { colors, typography, radii, spacing, language, isSunMode } = useAppTheme();
    const [activeFilter, setActiveFilter] = useState<'cages' | 'vessels' | 'satellite'>('cages');

    const isSw = language === 'sw';

    const filters: { key: 'cages' | 'vessels' | 'satellite'; label: string }[] = [
        { key: 'cages', label: isSw ? 'Vizimba' : 'Cages' },
        { key: 'vessels', label: isSw ? 'Meli / Boti' : 'Vessels' },
        { key: 'satellite', label: isSw ? 'Setilaiti' : 'Satellite' },
    ];

    return (
        <View 
            style={[
                styles.container,
                {
                    backgroundColor: colors.surfaceCard,
                    borderColor: isSunMode ? colors.borderStrong : colors.border,
                    borderWidth: isSunMode ? 2 : 1,
                    borderRadius: radii.md,
                },
                style
            ]}
        >
            {/* Filter Pills Header */}
            <View style={[styles.filtersRow, { padding: spacing.space3 }]}>
                {filters.map((f) => {
                    const isActive = activeFilter === f.key;
                    return (
                        <TouchableOpacity
                            key={f.key}
                            onPress={() => setActiveFilter(f.key)}
                            style={[
                                styles.filterPill,
                                {
                                    backgroundColor: isActive ? colors.primary : colors.surfaceSunken,
                                    borderColor: isSunMode ? colors.borderStrong : (isActive ? colors.primary : colors.border),
                                    borderWidth: isSunMode ? 2 : 1,
                                    borderRadius: radii.pill,
                                    marginRight: spacing.space2,
                                }
                            ]}
                        >
                            <Text
                                style={[
                                    styles.filterText,
                                    {
                                        color: isActive ? colors.onPrimary : colors.ink,
                                        fontSize: typography.caption.fontSize,
                                        fontWeight: isActive ? '700' : '500',
                                    }
                                ]}
                            >
                                {f.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Offline Grid Visualization */}
            <View 
                style={[
                    styles.gridArea,
                    {
                        backgroundColor: isSunMode ? '#ffffff' : colors.surfaceSunken,
                        borderColor: isSunMode ? colors.borderStrong : colors.border,
                        borderTopWidth: 1,
                        borderBottomWidth: 1,
                    }
                ]}
            >
                {/* Simulated Lake coordinates & grid markers */}
                <View style={[styles.marker, { top: '35%', left: '30%', borderColor: colors.ok, backgroundColor: colors.okWash }]}>
                    <IconButton icon="fish" size={16} iconColor={colors.ok} style={{ margin: 0 }} />
                </View>
                <View style={[styles.marker, { top: '25%', left: '55%', borderColor: colors.critical, backgroundColor: colors.criticalWash }]}>
                    <IconButton icon="close" size={16} iconColor={colors.critical} style={{ margin: 0 }} />
                </View>
                <View style={[styles.marker, { top: '65%', left: '70%', borderColor: colors.ok, backgroundColor: colors.okWash }]}>
                    <IconButton icon="fish" size={16} iconColor={colors.ok} style={{ margin: 0 }} />
                </View>

                {/* Grid Overlay lines */}
                <View style={[styles.gridLineHorizontal, { top: '33%', borderColor: colors.border }]} />
                <View style={[styles.gridLineHorizontal, { top: '66%', borderColor: colors.border }]} />
                <View style={[styles.gridLineVertical, { left: '33%', borderColor: colors.border }]} />
                <View style={[styles.gridLineVertical, { left: '66%', borderColor: colors.border }]} />

                {/* Floating Offline Saved Notice */}
                <View 
                    style={[
                        styles.noticeBox,
                        {
                            backgroundColor: colors.surfaceCard,
                            borderColor: isSunMode ? colors.borderStrong : colors.border,
                            borderWidth: 1,
                            borderRadius: radii.md,
                        }
                    ]}
                >
                    <Text style={[styles.noticeText, { color: colors.inkMuted, fontSize: typography.caption.fontSize }]}>
                        {isSw 
                            ? `Ramani haijapakiwa. Inaonyesha maeneo yaliyohifadhiwa ${savedTime}.`
                            : `Map not loaded. Showing positions saved ${savedTime}.`}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        overflow: 'hidden',
    },
    filtersRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    filterPill: {
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    filterText: {
        letterSpacing: 0.1,
    },
    gridArea: {
        height: 180,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    gridLineHorizontal: {
        position: 'absolute',
        width: '100%',
        borderTopWidth: 1,
        borderStyle: 'dashed',
    },
    gridLineVertical: {
        position: 'absolute',
        height: '100%',
        borderLeftWidth: 1,
        borderStyle: 'dashed',
    },
    marker: {
        position: 'absolute',
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    noticeBox: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        right: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
        alignItems: 'center',
        zIndex: 20,
    },
    noticeText: {
        fontWeight: '500',
    }
});

export default MapPanel;
