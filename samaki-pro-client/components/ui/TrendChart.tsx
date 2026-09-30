import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Line, Path, Circle, Rect, Text as SvgText } from 'react-native-svg';
import { useAppTheme } from '~/theme';
import SourceTag, { SourceType } from './SourceTag';

interface TrendChartProps {
    title?: string;
    threshold?: number;
    thresholdLabel?: string;
    source?: SourceType;
    sourceFooter?: string;
    style?: any;
}

export const TrendChart: React.FC<TrendChartProps> = ({
    title = 'Dissolved oxygen, last 24 hours',
    threshold = 5.0,
    thresholdLabel = 'Limit 5.0',
    source = 'sensor',
    sourceFooter = 'mg/L · Cage B2',
    style
}) => {
    const { colors, typography, radii, spacing, isSunMode } = useAppTheme();

    const width = 320;
    const height = 180;
    const paddingLeft = 36;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 30;

    // Y scale: min 4, max 8
    const getY = (val: number) => {
        const minVal = 4;
        const maxVal = 8;
        const availableHeight = height - paddingTop - paddingBottom;
        const normalized = (val - minVal) / (maxVal - minVal);
        return height - paddingBottom - normalized * availableHeight;
    };

    // X positions for 24 hours (0 to 24)
    const getX = (hour: number) => {
        const availableWidth = width - paddingLeft - paddingRight;
        return paddingLeft + (hour / 24) * availableWidth;
    };

    // Points: (0, 6.4), (4, 6.6), (8, 6.0), (12, 5.5), (16, 5.1)
    // Gap from hour 17 to 21 ("No reading")
    // Reconnection at (22, 5.7), (24, 6.0)
    const p1 = `${getX(0)},${getY(6.4)}`;
    const p2 = `${getX(4)},${getY(6.6)}`;
    const p3 = `${getX(8)},${getY(6.0)}`;
    const p4 = `${getX(12)},${getY(5.5)}`;
    const p5 = `${getX(16)},${getY(5.1)}`;
    const pathPart1 = `M ${p1} L ${p2} L ${p3} L ${p4} L ${p5}`;

    const p6 = `${getX(22)},${getY(5.7)}`;
    const p7 = `${getX(24)},${getY(6.0)}`;
    const pathPart2 = `M ${p6} L ${p7}`;

    const thresholdY = getY(threshold);

    const gapStartX = getX(16.5);
    const gapWidth = getX(21.5) - gapStartX;

    return (
        <View 
            style={[
                styles.container,
                {
                    backgroundColor: colors.surfaceCard,
                    borderColor: isSunMode ? colors.borderStrong : colors.border,
                    borderWidth: isSunMode ? 2 : 1,
                    borderRadius: radii.md,
                    padding: spacing.space4,
                },
                style
            ]}
        >
            <Text style={[styles.title, { color: colors.ink, fontSize: typography.heading.fontSize }]}>
                {title}
            </Text>

            <View style={{ alignItems: 'center', marginVertical: spacing.space2 }}>
                <Svg width={width} height={height}>
                    {/* Grid horizontal lines */}
                    {[4, 5, 6, 7, 8].map((val) => (
                        <React.Fragment key={val}>
                            <Line
                                x1={paddingLeft}
                                y1={getY(val)}
                                x2={width - paddingRight}
                                y2={getY(val)}
                                stroke={colors.border}
                                strokeWidth="1"
                                strokeDasharray="3 3"
                            />
                            <SvgText
                                x={paddingLeft - 8}
                                y={getY(val) + 4}
                                fill={colors.inkMuted}
                                fontSize="11"
                                textAnchor="end"
                                fontWeight="500"
                            >
                                {val}
                            </SvgText>
                        </React.Fragment>
                    ))}

                    {/* Gap "No reading" shaded zone */}
                    <Rect
                        x={gapStartX}
                        y={paddingTop}
                        width={gapWidth}
                        height={height - paddingTop - paddingBottom}
                        fill={isSunMode ? '#f0f0f0' : colors.surfaceSunken}
                        stroke={colors.border}
                        strokeDasharray="2 2"
                    />
                    <SvgText
                        x={gapStartX + gapWidth / 2}
                        y={paddingTop + 45}
                        fill={colors.inkMuted}
                        fontSize="10"
                        fontWeight="600"
                        textAnchor="middle"
                    >
                        No
                    </SvgText>
                    <SvgText
                        x={gapStartX + gapWidth / 2}
                        y={paddingTop + 58}
                        fill={colors.inkMuted}
                        fontSize="10"
                        fontWeight="600"
                        textAnchor="middle"
                    >
                        reading
                    </SvgText>

                    {/* Critical threshold line */}
                    <Line
                        x1={paddingLeft}
                        y1={thresholdY}
                        x2={width - paddingRight}
                        y2={thresholdY}
                        stroke={colors.critical}
                        strokeWidth="2"
                        strokeDasharray="4 4"
                    />
                    <SvgText
                        x={paddingLeft + 6}
                        y={thresholdY - 6}
                        fill={colors.critical}
                        fontSize="11"
                        fontWeight="700"
                    >
                        {thresholdLabel}
                    </SvgText>

                    {/* Trend Line (green) */}
                    <Path
                        d={pathPart1}
                        fill="none"
                        stroke={colors.primary}
                        strokeWidth="2.5"
                    />
                    <Path
                        d={pathPart2}
                        fill="none"
                        stroke={colors.primary}
                        strokeWidth="2.5"
                    />

                    {/* Data dots */}
                    {[[0, 6.4], [4, 6.6], [8, 6.0], [12, 5.5], [16, 5.1], [22, 5.7], [24, 6.0]].map(([h, v], i) => (
                        <Circle
                            key={i}
                            cx={getX(h)}
                            cy={getY(v)}
                            r="4"
                            fill={colors.surfaceCard}
                            stroke={colors.primary}
                            strokeWidth="2.5"
                        />
                    ))}

                    {/* X-axis labels */}
                    {[0, 4, 8, 12, 16, 20, 24].map((h) => (
                        <SvgText
                            key={h}
                            x={getX(h)}
                            y={height - 8}
                            fill={colors.inkMuted}
                            fontSize="11"
                            textAnchor="middle"
                            fontWeight="500"
                        >
                            {h.toString().padStart(2, '0')}
                        </SvgText>
                    ))}
                </Svg>
            </View>

            <View style={styles.footerRow}>
                <SourceTag source={source} />
                <Text style={[styles.footerText, { color: colors.inkMuted, fontSize: typography.caption.fontSize, marginLeft: spacing.space2 }]}>
                    {sourceFooter}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    title: {
        fontWeight: '700',
    },
    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    footerText: {
        fontWeight: '500',
    }
});

export default TrendChart;
