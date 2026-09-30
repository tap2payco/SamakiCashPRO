import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useAppTheme } from '~/theme';
import StatusBadge, { BadgeStatus } from './StatusBadge';
import SourceTag, { SourceType } from './SourceTag';

interface MetricCardProps {
    label: string;
    value: string | number;
    unit?: string;
    currencyPrefix?: string;
    status?: BadgeStatus;
    statusLabel?: string;
    trend?: {
        direction: 'up' | 'down' | 'flat';
        percent: string | number;
        comparisonText?: string;
    };
    source?: SourceType;
    sourceTimestamp?: string;
    onPress?: () => void;
    style?: any;
}

export const MetricCard: React.FC<MetricCardProps> = ({
    label,
    value,
    unit,
    currencyPrefix,
    status,
    statusLabel,
    trend,
    source,
    sourceTimestamp,
    onPress,
    style
}) => {
    const { colors, typography, radii, spacing, shadows, isSunMode } = useAppTheme();

    const isNoReading = value === null || value === undefined || value === '—' || value === '-';

    const CardComponent = onPress ? TouchableOpacity : View;

    return (
        <CardComponent
            onPress={onPress}
            activeOpacity={onPress ? 0.8 : 1}
            style={[
                styles.container,
                {
                    backgroundColor: colors.surfaceCard,
                    borderColor: isSunMode ? colors.borderStrong : colors.border,
                    borderWidth: isSunMode ? 2 : 1,
                    borderRadius: radii.md,
                    padding: spacing.space4,
                    ...(!isSunMode ? shadows : {}),
                },
                style
            ]}
        >
            {/* Header: Label */}
            <Text 
                style={[
                    styles.label, 
                    { 
                        color: colors.inkMuted, 
                        fontSize: typography.label.fontSize 
                    }
                ]}
                numberOfLines={1}
            >
                {label}
            </Text>

            {/* Main Figure Display */}
            <View style={[styles.figureRow, { marginVertical: spacing.space2 }]}>
                {currencyPrefix && (
                    <Text 
                        style={[
                            styles.currencyPrefix, 
                            { 
                                color: colors.ink, 
                                fontSize: typography.subhead.fontSize 
                            }
                        ]}
                    >
                        {currencyPrefix}{' '}
                    </Text>
                )}
                <Text 
                    style={[
                        styles.figureValue, 
                        { 
                            color: colors.ink, 
                            fontSize: currencyPrefix ? typography.figure.fontSize : typography.figureHero.fontSize,
                            lineHeight: currencyPrefix ? typography.figure.lineHeight : typography.figureHero.lineHeight,
                        }
                    ]}
                >
                    {isNoReading ? '—' : value}
                </Text>
                {unit && !isNoReading && (
                    <Text 
                        style={[
                            styles.unit, 
                            { 
                                color: colors.inkMuted, 
                                fontSize: typography.subhead.fontSize 
                            }
                        ]}
                    >
                        {' '}{unit}
                    </Text>
                )}
            </View>

            {/* Status Badge */}
            {status && (
                <View style={{ marginBottom: spacing.space2 }}>
                    <StatusBadge status={status} label={statusLabel} size="sm" />
                </View>
            )}

            {/* Trend Indicator */}
            {trend && (
                <View style={[styles.trendRow, { marginBottom: spacing.space2 }]}>
                    <Text 
                        style={[
                            styles.trendText, 
                            { 
                                color: trend.direction === 'up' ? colors.ok : (trend.direction === 'down' ? colors.critical : colors.inkMuted),
                                fontSize: typography.caption.fontSize,
                            }
                        ]}
                    >
                        {trend.direction === 'up' ? '↗ +' : (trend.direction === 'down' ? '↘ -' : '→ ')}
                        {trend.percent}%
                    </Text>
                    {trend.comparisonText && (
                        <Text 
                            style={[
                                styles.comparisonText, 
                                { 
                                    color: colors.inkMuted, 
                                    fontSize: typography.caption.fontSize,
                                    marginLeft: spacing.space1 
                                }
                            ]}
                        >
                            {trend.comparisonText}
                        </Text>
                    )}
                </View>
            )}

            {/* Source Tag Attribution */}
            {source && (
                <View style={{ marginTop: spacing.space1 }}>
                    <SourceTag source={source} timestamp={sourceTimestamp} />
                </View>
            )}
        </CardComponent>
    );
};

const styles = StyleSheet.create({
    container: {
        minWidth: 140,
        flex: 1,
    },
    label: {
        fontWeight: '600',
    },
    figureRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    currencyPrefix: {
        fontWeight: '700',
    },
    figureValue: {
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    unit: {
        fontWeight: '600',
    },
    trendRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    trendText: {
        fontWeight: '700',
    },
    comparisonText: {
        fontWeight: '500',
    }
});

export const StatCard = MetricCard;
export default MetricCard;
