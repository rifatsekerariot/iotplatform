import React, { useMemo } from 'react';
import cls from 'classnames';
import './style.less';

interface GreenhouseClimateViewProps {
    config: {
        title?: string;
        temperatureSensor?: string;
        humiditySensor?: string;
        co2Sensor?: string;
        lightSensor?: string;
        tempMin?: number;
        tempMax?: number;
        humidityMin?: number;
        humidityMax?: number;
        showIcons?: boolean;
        showStatus?: boolean;
    };
    entityData: Record<string, { value: any; timestamp?: number }>;
}

interface SensorConfig {
    id: string;
    label: string;
    icon: string;
    unit: string;
    min?: number;
    max?: number;
}

/**
 * Greenhouse Climate Widget - View Component
 * 
 * Bu component widget'ın dashboard'da nasıl görüneceğini belirler.
 * Seçilen sensörlerden gelen verileri gösterir ve eşik değerlerine
 * göre durum ikonları (✓, ⚠️, ❌) gösterir.
 */
export default function GreenhouseClimateView(props: GreenhouseClimateViewProps) {
    const { config, entityData } = props;

    // Sensör konfigürasyonlarını hazırla
    const sensors: SensorConfig[] = useMemo(() => {
        const result: SensorConfig[] = [];

        if (config.temperatureSensor) {
            result.push({
                id: config.temperatureSensor,
                label: 'Sıcaklık',
                icon: '🌡️',
                unit: '°C',
                min: config.tempMin,
                max: config.tempMax,
            });
        }

        if (config.humiditySensor) {
            result.push({
                id: config.humiditySensor,
                label: 'Nem',
                icon: '💧',
                unit: '%',
                min: config.humidityMin,
                max: config.humidityMax,
            });
        }

        if (config.co2Sensor) {
            result.push({
                id: config.co2Sensor,
                label: 'CO2',
                icon: '💨',
                unit: 'ppm',
            });
        }

        if (config.lightSensor) {
            result.push({
                id: config.lightSensor,
                label: 'Işık',
                icon: '☀️',
                unit: 'lux',
            });
        }

        return result;
    }, [config]);

    // Değerin durumunu kontrol et (normal, uyarı, alarm)
    const getStatus = (value: number, min?: number, max?: number): 'normal' | 'warning' | 'danger' => {
        if (min !== undefined && value < min) return 'danger';
        if (max !== undefined && value > max) return 'danger';
        if (min !== undefined && value < min * 1.1) return 'warning';
        if (max !== undefined && value > max * 0.9) return 'warning';
        return 'normal';
    };

    // Durum ikonunu al
    const getStatusIcon = (status: 'normal' | 'warning' | 'danger'): string => {
        switch (status) {
            case 'normal': return '✓';
            case 'warning': return '⚠️';
            case 'danger': return '❌';
        }
    };

    // Değeri formatla
    const formatValue = (value: any): string => {
        if (value === undefined || value === null) return '--';
        const num = Number(value);
        if (isNaN(num)) return '--';
        return num.toFixed(1);
    };

    return (
        <div className="greenhouse-climate-widget">
            {/* Header */}
            <div className="gc-header">
                {config.showIcons && <span className="gc-main-icon">🌱</span>}
                <span className="gc-title">{config.title || 'Sera İklim Durumu'}</span>
            </div>

            {/* Metrics Grid */}
            <div className="gc-metrics-grid">
                {sensors.length === 0 ? (
                    <div className="gc-empty-state">
                        <p>⚙️ Lütfen sensör seçin</p>
                    </div>
                ) : (
                    sensors.map((sensor) => {
                        const data = entityData[sensor.id];
                        const value = data?.value;
                        const numValue = Number(value);
                        const status = !isNaN(numValue)
                            ? getStatus(numValue, sensor.min, sensor.max)
                            : 'normal';

                        return (
                            <div
                                key={sensor.id}
                                className={cls('gc-metric-row', `gc-status-${status}`)}
                            >
                                {config.showIcons && (
                                    <span className="gc-metric-icon">{sensor.icon}</span>
                                )}
                                <div className="gc-metric-content">
                                    <span className="gc-metric-label">{sensor.label}:</span>
                                    <span className="gc-metric-value">
                                        {formatValue(value)}
                                        <span className="gc-metric-unit">{sensor.unit}</span>
                                    </span>
                                </div>
                                {config.showStatus && (
                                    <span className={cls('gc-status-icon', `gc-status-${status}`)}>
                                        {getStatusIcon(status)}
                                    </span>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Footer - Son güncelleme zamanı */}
            {sensors.length > 0 && (
                <div className="gc-footer">
                    <span className="gc-update-time">
                        {entityData[sensors[0].id]?.timestamp
                            ? new Date(entityData[sensors[0].id]?.timestamp || 0).toLocaleTimeString('tr-TR')
                            : 'güncelleniyor...'}
                    </span>
                </div>
            )}
        </div>
    );
}
