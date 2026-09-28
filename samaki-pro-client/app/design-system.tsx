import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Surface, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CleanEnterpriseTheme, spacing } from '~/theme';
import { GlassCard, StatusBadge } from '~/components/ui';

export default function DesignSystemScreen() {
    const { colors, fonts } = CleanEnterpriseTheme;

    const ColorBlock = ({ name, color, textColor = '#fff' }: { name: string, color: string, textColor?: string }) => (
        <View style={[styles.colorBlock, { backgroundColor: color }]}>
            <Text style={{ color: textColor, fontWeight: 'bold' }}>{name}</Text>
            <Text style={{ color: textColor, fontSize: 12 }}>{color}</Text>
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text variant="displaySmall" style={styles.header}>Design System</Text>
                
                {/* Colors */}
                <Text variant="titleLarge" style={styles.sectionTitle}>1. Colors</Text>
                <View style={styles.colorGrid}>
                    <ColorBlock name="Primary" color={colors.primary} />
                    <ColorBlock name="Secondary" color={colors.secondary} />
                    <ColorBlock name="Background" color={colors.background} textColor="#000" />
                    <ColorBlock name="Surface" color={colors.surface} textColor="#000" />
                </View>

                <Text variant="titleMedium" style={styles.subTitle}>Semantic / Status</Text>
                <View style={styles.colorGrid}>
                    <ColorBlock name="Success" color={colors.success} />
                    <ColorBlock name="Warning" color={colors.warning} textColor="#000" />
                    <ColorBlock name="Error" color={colors.error} />
                    <ColorBlock name="Info" color={colors.info} />
                </View>

                <Divider style={styles.divider} />

                {/* Typography */}
                <Text variant="titleLarge" style={styles.sectionTitle}>2. Typography (Inter)</Text>
                <Surface style={styles.surfaceCard}>
                    <Text variant="displayMedium" style={{fontFamily: fonts.displayMedium.fontFamily}}>Display Medium</Text>
                    <Text variant="headlineLarge" style={{fontFamily: fonts.headlineLarge.fontFamily}}>Headline Large</Text>
                    <Text variant="titleLarge" style={{fontFamily: fonts.titleLarge.fontFamily}}>Title Large</Text>
                    <Text variant="bodyLarge" style={{fontFamily: fonts.bodyLarge.fontFamily}}>Body Large - The quick brown fox jumps over the lazy dog.</Text>
                    <Text variant="labelLarge" style={{fontFamily: fonts.labelLarge.fontFamily}}>LABEL LARGE</Text>
                </Surface>

                <Divider style={styles.divider} />

                {/* UI Components */}
                <Text variant="titleLarge" style={styles.sectionTitle}>3. Custom UI Components</Text>
                
                <Text variant="titleMedium" style={styles.subTitle}>StatusBadges</Text>
                <View style={styles.badgeContainer}>
                    <StatusBadge status="success" label="Completed" />
                    <StatusBadge status="warning" label="Pending" />
                    <StatusBadge status="info" label="In Transit" />
                    <StatusBadge status="error" label="Failed" />
                    <StatusBadge status="default" label="Draft" />
                </View>

                <Text variant="titleMedium" style={[styles.subTitle, { marginTop: spacing.lg }]}>GlassCard</Text>
                <View style={styles.bgPreview}>
                    <GlassCard>
                        <Text variant="titleMedium">Glassmorphism Card</Text>
                        <Text variant="bodyMedium" style={{ marginTop: spacing.sm }}>
                            This component applies the signature blur and border styles automatically based on the theme roundness.
                        </Text>
                    </GlassCard>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: spacing.lg,
        paddingBottom: spacing.xxl,
    },
    header: {
        fontWeight: '900',
        marginBottom: spacing.xl,
        color: CleanEnterpriseTheme.colors.primary,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: spacing.md,
        color: CleanEnterpriseTheme.colors.primary,
    },
    subTitle: {
        fontWeight: '600',
        marginBottom: spacing.sm,
        marginTop: spacing.md,
    },
    divider: {
        marginVertical: spacing.xl,
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    colorBlock: {
        width: 100,
        height: 100,
        borderRadius: CleanEnterpriseTheme.roundness,
        padding: spacing.sm,
        justifyContent: 'flex-end',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    surfaceCard: {
        padding: spacing.md,
        borderRadius: CleanEnterpriseTheme.roundness,
        backgroundColor: CleanEnterpriseTheme.colors.surface,
        gap: spacing.sm,
    },
    badgeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    bgPreview: {
        backgroundColor: CleanEnterpriseTheme.colors.primaryContainer,
        padding: spacing.xl,
        borderRadius: CleanEnterpriseTheme.roundness,
    }
});
