const fs = require('fs');
const path = require('path');
const https = require('https');

const jsonPath = 'C:/Users/Kimo Store/.gemini/antigravity/brain/1f7dd2cd-fb52-4286-a617-f30af554d279/.system_generated/steps/166/output.txt';


if (!fs.existsSync(jsonPath)) {
    console.error("JSON file not found.");
    process.exit(1);
}

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Map local file paths to Stitch project screen titles
const routeMapping = {
  "src/app/(app)/visitor/shipments/page.tsx": "TNA My Shipments List - Active View",
  "src/app/(app)/visitor/addresses/page.tsx": "TNA Addresses List - Blue FAB Update",
  "src/app/(app)/owner/linking/page.tsx": "TNA Owner - Binding Requests Active List",
  "src/app/(app)/owner/addresses/[na_id]/variants/page.tsx": "TNA Owner - Create Sub-Address Form",
  "src/app/(app)/gov/users/page.tsx": "TNA Gov - Employee Management List",
  "src/app/(app)/gov/linking/[id]/page.tsx": "TNA Gov - Issuance Detail Review (Approved)",
  "src/app/(app)/gov/issuance/policy/page.tsx": "TNA Gov - Issuance Policy Configuration (Moderated)",
  "src/app/(app)/gov/issuance/page.tsx": "TNA Gov - Issuance Review Queue Active View",
  "src/app/(app)/gov/home/page.tsx": "TNA Government Dashboard Home",
  "src/app/(app)/gov/config/page.tsx": "TNA Advanced Filter Panel",
  "src/app/(app)/gov/audit/page.tsx": "TNA Gov - Audit Log Viewer List View",
  "src/app/(app)/gov/addresses/page.tsx": "TNA Gov - Sub-Address Document Review View",
  "src/app/(app)/carrier/shipments/[id]/confirm/page.tsx": "TNA Carrier - Register New Shipment Form",
  "src/app/(app)/carrier/shipments/page.tsx": "TNA Carrier - Delivery Location Map",
  "src/app/(app)/carrier/log/page.tsx": "TNA Activity Log - Activities Tab",
  "src/app/(app)/carrier/home/page.tsx": "TNA Carrier Home Dashboard (Driver)"
};

const basePath = "c:/Users/Kimo Store/Desktop/project-tna/project-a/frontend/tna-project";

function fetchHTML(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve(body));
        }).on('error', reject);
    });
}

function extractBody(html) {
    const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    // Return extracted body, or original if failed
    let content = match ? match[1] : html;
    
    // Stitch exports sometimes have fixed elements in the body or wrappers,
    // we should remove `<script>` tags if any to avoid errors.
    content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
    
    // We will inject it inside a dangerouslySetInnerHTML
    return content;
}

async function run() {
    for (const [route, title] of Object.entries(routeMapping)) {
        const screen = data.screens.find(s => s.title === title);
        
        if (screen && screen.htmlCode && screen.htmlCode.downloadUrl) {
            console.log(`Downloading ${title} for ${route}...`);
            const html = await fetchHTML(screen.htmlCode.downloadUrl);
            const innerHTML = extractBody(html);
            
            // Re-escape backticks and standard escapes so the JS literal evaluates properly
            const escapedHTML = innerHTML.replace(/\`/g, '\\\\`').replace(/\\$/g, '\\\\$');
            
            const component = `'use client';
import React, { useEffect, useRef } from 'react';

export default function Page() {
    const ref = useRef(null);
    useEffect(() => {
        // Hydration fix for styles if necessary
    }, []);

    return (
        <div 
            ref={ref}
            dangerouslySetInnerHTML={{ __html: \`${escapedHTML}\` }} 
            className="stitch-imported-design" />
    );
}
`;
            const fullPath = path.join(basePath, route);
            fs.mkdirSync(path.dirname(fullPath), { recursive: true });
            fs.writeFileSync(fullPath, component);
            console.log(`Saved ${route}`);
        } else {
            console.log(`Warning: Could not find screen or URL for title: ${title}`);
        }
    }
    console.log("DONE");
}

run().catch(err => console.error(err));
