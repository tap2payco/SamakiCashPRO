import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { useAppTheme } from '~/theme';
import SourceTag, { SourceType } from './SourceTag';
import StatusBadge from './StatusBadge';

export interface TableRowData {
    id: string;
    species: string;
    code: string;
    site: string;
    price?: number | string;
    change?: string;
    source?: SourceType | 'none';
}

interface DataTableProps {
    data?: TableRowData[];
    showDemoFooter?: boolean;
    style?: any;
}

const defaultMarketData: TableRowData[] = [
    { id: '1', species: 'Nile perch', code: 'PR-0001', site: 'Kirumba, Mwanza', price: 8300, change: '+2%', source: 'manual' },
    { id: '2', species: 'Tilapia', code: 'PR-0002', site: 'Igombe', price: 6100, change: '-1%', source: 'manual' },
    { id: '3', species: 'Dagaa', code: 'PR-0003', site: 'Nyegezi', price: 4500, change: '—', source: 'manual' },
    { id: '4', species: 'Nile perch', code: 'PR-0004', site: 'Ukerewe', price: '—', change: '—', source: 'none' },
];

export const DataTable: React.FC<DataTableProps> = ({
    data = defaultMarketData,
    showDemoFooter = true,
    style
}) => {
    const { colors, typography, radii, spacing, language, isSunMode } = useAppTheme();

    const isSw = language === 'sw';

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
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ minWidth: 620 }}>
                    {/* Header Row */}
                    <View 
                        style={[
                            styles.headerRow, 
                            { 
                                backgroundColor: colors.surfaceSunken,
                                borderBottomColor: isSunMode ? colors.borderStrong : colors.border,
                                borderBottomWidth: 1,
                            }
                        ]}
                    >
                        <Text style={[styles.headerCell, { width: 140, color: colors.inkMuted }]}>
                            {isSw ? 'Aina ya Samaki' : 'Species'}
                        </Text>
                        <Text style={[styles.headerCell, { width: 150, color: colors.inkMuted }]}>
                            {isSw ? 'Eneo' : 'Site'}
                        </Text>
                        <Text style={[styles.headerCell, { width: 110, textAlign: 'right', color: colors.inkMuted }]}>
                            {isSw ? 'Bei, TZS/kilo' : 'Price, TZS/kg'}
                        </Text>
                        <Text style={[styles.headerCell, { width: 90, textAlign: 'center', color: colors.inkMuted }]}>
                            {isSw ? 'Mabadiliko' : 'Change'}
                        </Text>
                        <Text style={[styles.headerCell, { width: 130, color: colors.inkMuted }]}>
                            {isSw ? 'Chanzo' : 'Source'}
                        </Text>
                    </View>

                    {/* Body Rows */}
                    {data.map((row, index) => {
                        const isLast = index === data.length - 1;
                        return (
                            <View 
                                key={row.id} 
                                style={[
                                    styles.bodyRow,
                                    !isLast && { 
                                        borderBottomColor: isSunMode ? colors.borderStrong : colors.border,
                                        borderBottomWidth: 1,
                                    }
                                ]}
                            >
                                <View style={{ width: 140 }}>
                                    <Text style={[styles.cellText, { color: colors.ink, fontWeight: '700' }]}>
                                        {row.species}
                                    </Text>
                                    <Text style={[styles.codeText, { color: colors.inkMuted, fontSize: typography.caption.fontSize }]}>
                                        {row.code}
                                    </Text>
                                </View>

                                <Text style={[styles.cellText, { width: 150, color: colors.ink }]}>
                                    {row.site}
                                </Text>

                                <Text style={[styles.cellText, { width: 110, textAlign: 'right', fontWeight: '700', color: colors.ink }]}>
                                    {typeof row.price === 'number' ? row.price.toLocaleString() : row.price}
                                </Text>

                                <Text 
                                    style={[
                                        styles.cellText, 
                                        { 
                                            width: 90, 
                                            textAlign: 'center', 
                                            color: row.change?.startsWith('+') 
                                                ? colors.ok 
                                                : (row.change?.startsWith('-') ? colors.critical : colors.inkMuted),
                                            fontWeight: '700',
                                        }
                                    ]}
                                >
                                    {row.change}
                                </Text>

                                <View style={{ width: 130 }}>
                                    {row.source === 'none' ? (
                                        <StatusBadge status="no-reading" size="sm" />
                                    ) : (
                                        <SourceTag source={row.source as SourceType} />
                                    )}
                                </View>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>

            {/* Footer with Demo data attribution */}
            {showDemoFooter && (
                <View 
                    style={[
                        styles.footer, 
                        { 
                            borderTopColor: isSunMode ? colors.borderStrong : colors.border,
                            borderTopWidth: 1,
                            backgroundColor: colors.surfaceSunken,
                            paddingHorizontal: spacing.space4,
                        }
                    ]}
                >
                    <SourceTag source="demo" />
                    <Text 
                        style={[
                            styles.footerText, 
                            { color: colors.inkMuted, fontSize: typography.caption.fontSize, marginLeft: spacing.space2 }
                        ]}
                    >
                        {isSw ? 'Bei zinazoonyeshwa ni mifano tu.' : 'Prices shown are sample data.'}
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        overflow: 'hidden',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    headerCell: {
        fontSize: 13,
        fontWeight: '700',
    },
    bodyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    cellText: {
        fontSize: 14,
    },
    codeText: {
        fontWeight: '500',
        marginTop: 2,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    footerText: {
        fontWeight: '500',
    }
});

export default DataTable;
