import React from 'react';

declare class FingerprintjsPro extends React.Component {
    static init(apiKey: string): void;
    static getVisitorId(): Promise<string>;
}
export default FingerprintjsPro;
