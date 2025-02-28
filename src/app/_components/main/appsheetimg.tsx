import React, { type CSSProperties } from 'react';
export type AppSheetImgProps = {
    url: string;
    className?: string;
    style?: CSSProperties
}
function buildImageUrl(pUrl: string) {
    const imageUrl = `https://www.appsheet.com/image/getimageurl?appName=StellaOrders-256960980&tableName=Productos&fileName=${pUrl}&appVersion=1.000007&signature=f534a03db01600adc54843c9bced34a556116ef570263b7659a1b8fd05fff038`
    return imageUrl;
}
const AppSheetImg = (props: AppSheetImgProps) => {
    const { url: pUrl } = props;
    return <>
        <img style={props.style} src={buildImageUrl(pUrl)} alt={pUrl}
            className={props.className}
        />
    </>
}
export default AppSheetImg;
