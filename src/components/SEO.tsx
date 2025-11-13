import {Helmet} from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    keywords?: string;
    ogImage?: string;
    path?: string;
}

export const SEO = ({title, description, keywords, ogImage, path = ''}: SEOProps) => {
    const siteUrl = 'https://fragmepls.dev';
    const canonicalUrl = `${siteUrl}${path}`;

    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description}/>
            {keywords && <meta name="keywords" content={keywords}/>}
            <link rel="canonical" href={canonicalUrl}/>

            <meta property="og:url" content={canonicalUrl}/>
            <meta property="og:title" content={title}/>
            <meta property="og:description" content={description}/>
            <meta property="og:type" content="website"/>
            {ogImage && <meta property="og:image" content={ogImage}/>}

            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:title" content={title}/>
            <meta name="twitter:description" content={description}/>
        </Helmet>
    );
};

