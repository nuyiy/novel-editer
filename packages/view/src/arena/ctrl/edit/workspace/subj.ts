import { BehaviorSubject, Subject } from 'rxjs'
import { debounceTime, merge } from 'rxjs/operators'
import { node_use$, chapter_list$, node_use_buffer$ } from '@/source'

/** 进入禅模式 */
export const zen$ = new BehaviorSubject(false)

/** 编辑器向下滚动文本 */
export const etbottom$ = new Subject()
/** 编辑器向上滚动文本 */
export const ettop$ = new Subject()
/** 下一章 */
export const etnext$ = new Subject()

// 下一章聚焦直接切换, 下面的读取文本抖动处理 ----
etnext$.pipe().subscribe(() => {
    const node_id = node_use$.value?.id
    const cps = chapter_list$.value
    if (!node_id) {
        return
    }
    const nodes: node[] = []

    cps.forEach((cp) => {
        cp.children.forEach((nd, i) => {
            nodes.push(nd)
        })
    })
    const fi = nodes.findIndex((v) => v.id === node_id)
    if (fi < nodes.length - 1) {
        const nextnode = nodes[fi + 1]
        node_use$.next(nextnode)
    }
})

// ----
/** 上一章 */
export const etprev$ = new Subject()

// 上一章聚焦直接切换, 下面的读取文本抖动处理 ----
etprev$.pipe().subscribe(() => {
    const node_id = node_use$.value?.id
    const cps = chapter_list$.value
    if (!node_id) {
        return
    }
    const nodes: node[] = []

    cps.forEach((cp) => {
        cp.children.forEach((nd, i) => {
            nodes.push(nd)
        })
    })
    const fi = nodes.findIndex((v) => v.id === node_id)
    if (fi > 0) {
        const nextnode = nodes[fi - 1]
        node_use$.next(nextnode)
    }
})
// 抖动读取文本
etprev$.pipe(merge(etnext$), debounceTime(300)).subscribe(() => {
    const node = node_use$.value
    if (!node) {
        return
    }

    const arr = node_use_buffer$.value
    if (!arr.find((v) => v.id === node.id)) {
        arr.push(node)
    }
    node_use_buffer$.next([...arr].slice(-5))
})
// ----
