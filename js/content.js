import { round, score } from './score.js';

const dir = '/data';

function parsePercent(val) {
    if (typeof val === 'number') {
        return { isRange: false, start: 0, end: val, span: val };
    }
    const str = String(val).replace('%', '').trim();
    if (str.includes('-')) {
        const parts = str.split('-').map((n) => parseFloat(n.trim()));
        const start = isNaN(parts[0]) ? 0 : parts[0];
        const end = isNaN(parts[1]) ? 0 : parts[1];
        return { isRange: true, start, end, span: Math.max(0, end - start) };
    }
    const num = parseFloat(str);
    const valid = isNaN(num) ? 0 : num;
    return { isRange: false, start: 0, end: valid, span: valid };
}

export async function fetchList() {
    const listResult = await fetch(`${dir}/_list.json`);
    try {
        const list = await listResult.json();
        return await Promise.all(
            list.map(async (path, rank) => {
                const levelResult = await fetch(`${dir}/${path}.json`);
                try {
                    const level = await levelResult.json();
                    return [
                        {
                            ...level,
                            path,
                            records: level.records.sort((a, b) => {
                                const parsedA = parsePercent(a.percent);
                                const parsedB = parsePercent(b.percent);
                                if (parsedB.end !== parsedA.end) {
                                    return parsedB.end - parsedA.end;
                                }
                                return parsedB.span - parsedA.span;
                            }),
                        },
                        null,
                    ];
                } catch {
                    console.error(`Failed to load level #${rank + 1} ${path}.`);
                    return [null, path];
                }
            }),
        );
    } catch {
        console.error(`Failed to load list.`);
        return null;
    }
}

export async function fetchEditors() {
    try {
        const editorsResults = await fetch(`${dir}/_editors.json`);
        const editors = await editorsResults.json();
        return editors;
    } catch {
        return null;
    }
}

export async function fetchLeaderboard() {
    const list = await fetchList();

    const scoreMap = {};
    const errs = [];
    list.forEach(([level, err], rank) => {
        if (err) {
            errs.push(err);
            return;
        }

        level.records.forEach((record) => {
            const user = Object.keys(scoreMap).find(
                (u) => u.toLowerCase() === record.user.toLowerCase(),
            ) || record.user;
            scoreMap[user] ??= {
                verified: [],
                completed: [],
                progressed: [],
            };
            const { completed, progressed } = scoreMap[user];
            const parsed = parsePercent(record.percent);

            if (!parsed.isRange && parsed.end === 100) {
                completed.push({
                    rank: rank + 1,
                    level: level.name,
                    score: score(rank + 1, 100, level.percentToQualify),
                    link: record.link,
                });
                return;
            }

            progressed.push({
                rank: rank + 1,
                level: level.name,
                percent: record.percent,
                score: score(rank + 1, parsed.span, level.percentToQualify),
                link: record.link,
            });
        });
    });

    const res = Object.entries(scoreMap).map(([user, scores]) => {
        const { verified, completed, progressed } = scores;
        const total = [verified, completed, progressed]
            .flat()
            .reduce((prev, cur) => prev + cur.score, 0);

        return {
            user,
            total: round(total),
            ...scores,
        };
    });

    return [res.sort((a, b) => b.total - a.total), errs];
}