"""《会唱歌的路》· 风格 C（盲听挑战）：四道题穿插知识卡。"""
import synth
from scripts.road import *

PAGE, OUTPUT = 'quiz.html', '会唱歌的路_C版'
META = dict(logo='盲听挑战')
VOICE, RATE = 'zh-CN-YunjianNeural', '+38%'
GAP, LEAD, TAIL = 0.1, 0.25, 1.2
VOICE_DB, CLIP_DB, MUSIC_DB, DUCK = -19.0, -21.0, -34.0, 0.55
PICK = 2.1

K = lambda widget, title, **d: dict(widget=widget, title=title, **d)
SCENES = [
    dict(id='intro', type='full', data=dict(widget='hook', clip='hun', ratio='16/9', title='会唱歌的<em>路</em>',
                                            chips=[('四道题，都要用耳朵听路', 'rule'), ('耳机音量先调小', 'ear')]), steps=[
        clip('hun', gap=0.15),
        say("开车经过这段路，轮胎底下冒出一段旋律。[[q]]不是车里的音响，是*路在唱歌*。"),
        say("[[rule]]这期{4 道题|四道题}，都要用耳朵听路。[[ear]]友情提示：耳机音量先调小。"),
    ]),
    dict(id='k1', type='know', data=K('figs', '第一条会唱歌的路', mode='one', items=[
        dict(src=F_ARTISTS, tag='丹麦 · 1995', cap='两位艺术家在铺路标', cue='f1'),
        dict(src=F_MARKERS, tag='等间隔的凸起', cap='间隔不同，音就不同', cue='f2')]), steps=[
        say("[[f1]]这个点子来自两位丹麦艺术家。{1995 年|一九九五年}，他们在丹麦的 Gylling 修了世界上第一条会唱歌的路，还起了个名字，叫 Asphaltophone。"),
        say("做法很简单：[[f2]]把凸起的路标，*等间隔*地铺在路面上。"),
    ]),
    dict(id='k2', type='know', data=K('calc', '间隔怎么算', lines=[
        dict(t='车轮每压过一排凸起，就撞一下', cue='c1'),
        dict(t='每秒撞的次数 = 频率', cue='c2'),
        dict(t='间隔 = 车速 ÷ 频率', cue='c3', big=True),
        dict(t='中央 C：264 Hz　车速：60 km/h ≈ 16.7 m/s', cue='c4'),
        dict(t='16.7 ÷ 264 ≈ 0.063 m = 6.3 cm', cue='c5', big=True),
        dict(t='车速一定：一个音对应一个间隔', cue='c6')]), steps=[
        say("[[c1]]车轮每压过一排凸起，就撞一下。[[c2]]每秒撞多少下，就是声音的*频率*。"),
        say("[[c3]]所以，间隔等于车速除以频率。[[c4]]比如中央 C，每秒振动 {264|二百六十四} 次，车速每小时 {60 公里|六十公里}，[[c5]]凸起的间隔就是 *{6.3 厘米|六点三厘米}*。"),
        say("[[c6]]车速一定，一个音对应一个间隔。改变间隔，就能在路上*谱曲*。"),
    ]),
    dict(id='r1', type='round', data=dict(no=1, title='这条路在唱什么？', sub='韩国 · 安养', mode='choice', q='A 还是 B？', video=True, hide=True, answer='b',
                                          a=dict(label='两只老虎'), b=dict(label='玛丽有只小羊羔', tip='Mary Had a Little Lamb')), steps=[
        say("*第一题*。韩国，首尔和水原之间的安养。画面先藏起来，听听这条路唱的儿歌。"), clip('kor'),
        say("[[ask]]A，《两只老虎》；B，《玛丽有只小羊羔》。"), wait(PICK, name='pick'),
        say("[[reveal]]答案是 B。这是一段 S 弯，司机开久了容易犯困，突然响起的儿歌能把人*叫醒*。后来，它倒成了打卡景点。"), clip('kor2'),
    ]),
    dict(id='k3', type='know', data=K('media', '日本：35 条会唱歌的路', ratio='2/1', labels=dict(jp='日本'), cap='日本还有一条“音乐隧道”'), steps=[
        say("[[cap]]日本人修这种路，主要是为了吸引游客。据统计，日本有 {35 条|三十五条}会唱歌的路，还有一条*音乐隧道*，曲子有流行歌，也有贝多芬的《欢乐颂》。"),
        clip('jp'),
    ]),
    dict(id='r2', type='round', data=dict(no=2, title='哪条路跑调了？', sub='两条都在美国', stamp='扣鸡腿！',
                                          a=dict(clip='r66', label='66 号公路', kind='440', tip='《美丽的亚美利加》'), b=dict(clip='lan', label='Lancaster', kind='432', tip='《威廉·退尔序曲》')), steps=[
        say("*第二题*。美国的两条路，先听 A。"), clip('r66'),
        say("再听 B。"), clip('lan'),
        say("哪一条，*跑调*了？"), wait(PICK, name='pick'),
        say("[[reveal]]是 B。加州 Lancaster 这条，是本田为了宣传思域修的，唱《威廉·退尔序曲》。凸起的间隔没算好，曲子就*跑调*了，[[stamp]]修路的工程师该扣鸡腿。"),
        say("它还被附近居民投诉，拆了以后，在五公里外重修。A 在著名的 {66 号|六十六号}公路上，唱《美丽的亚美利加》，修它是为了提醒司机别超速。"),
    ]),
    dict(id='k4', type='know', data=K('figs', '车速也要对', mode='stack', items=[
        dict(src=F_SIGN, tag='前方', cap='会唱歌的路', cue='s1'),
        dict(src=F_SPEED, tag='限速', cap='降到每小时 45 英里', cue='s2')]), steps=[
        say("[[s1]]反过来，凸起一旦铺好，间隔就固定了。想听到原曲，车速就得开到设计的速度。[[s2]]所以很多会唱歌的路，前面都立着*限速牌*。"),
    ]),
    dict(id='r3', type='round', data=dict(no=3, title='哪辆车开慢了？', sub='同一段路，同一首歌 · 程序模拟', stamp='低了一个八度！',
                                          a=dict(clip='fast', label='按限速开', kind='440', tip='原调'), b=dict(clip='slow', label='速度减半', kind='432', tip='又慢又低')), steps=[
        say("*第三题*。同一段路，两辆车开过去。先听 A。"), clip('fast'),
        say("再听 B。"), clip('slow'),
        say("哪一辆，*开慢了*？"), wait(PICK, name='pick'),
        say("[[reveal]]是 B，它只开了一半的速度。每秒撞的次数少了一半，频率减半，[[stamp]]不光变慢，*音调也低了一个八度*。"),
    ]),
    dict(id='r4', type='round', data=dict(no=4, title='这条路在唱什么？', sub='北京 · 千灵山', mode='choice', q='A 还是 B？', video=True, hide=True, answer='a',
                                          a=dict(label='歌唱祖国', tip='车速 40 km/h'), b=dict(label='茉莉花')), steps=[
        say("*第四题*。北京丰台的千灵山，车速到每小时 {40 公里|四十公里}，就能听到一首歌。"), clip('cn'),
        say("[[ask]]A，《歌唱祖国》；B，《茉莉花》。"), wait(PICK, name='pick'),
        say("[[reveal]]答案是 A，《歌唱祖国》。这条路也是为了提醒司机别超速，顺便吸引去景区的游客。"),
    ]),
    dict(id='k5', type='know', data=K('list', '世界各地会唱歌的路', items=[
        dict(t='丹麦', s='1995 · 艺术家的点子', cue='l1'),
        dict(t='匈牙利', s='纪念乐队主唱 · 开头那段', cue='l2'),
        dict(t='韩国', s='叫醒犯困的司机', cue='l3'),
        dict(t='日本', s='35 条 · 吸引游客', cue='l4'),
        dict(t='美国', s='广告，也提醒别超速', cue='l5'),
        dict(t='中国', s='2013 · 河南长葛最早', cue='l6')]), steps=[
        say("[[l1]]盘点一下：丹麦是艺术家的点子；[[l2]]开头那段在匈牙利的 {67 号|六十七号}公路，为了纪念国宝级乐队 Republic 的主唱，唱的就是他们的《{67 号|六十七号}公路》；[[l3]]韩国为了叫醒司机；[[l4]]日本为了游客；[[l5]]美国有广告，也有提醒限速。"),
        say("[[l6]]中国第一条，是 {2013 年|二零一三年}河南长葛的音乐路面，唱《义勇军进行曲》和《茉莉花》；第二年，烟台也修了两条。"),
    ]),
    dict(id='outro', type='outro', data=dict(sources=SOURCES, score='你对了几题？', concl='间隔 = 车速 ÷ 频率',
                                             answers=[('B 小羊羔', '韩国'), ('B 跑调', 'Lancaster'), ('B 开慢了', '低八度'), ('A 歌唱祖国', '千灵山')]), steps=[
        say("[[score]]{4 道题|四道题}，你对了几道？"),
        say("[[concl]]会唱歌的路，靠的就是一个公式：间隔等于车速除以频率。"),
        say("[[src]]就是有点费轮胎。有机会的话，你愿意开车去听一听吗？"),
    ]),
]


def music(total, scenes):
    return synth.bgm_quiz(total)[0]


def sfx(scenes):
    ev = [(s['start'] - 0.1, 'whoosh', -22) for s in scenes[1:]]
    for s in scenes:
        if 'reveal' in s['cues']:
            ev.append((s['cues']['reveal'], 'ding', -16))
        for st in s['steps']:
            if st['kind'] == 'wait' and st.get('name') == 'pick':
                d = st['end'] - st['start']
                ev += [(st['start'] + i * d / 3, 'tick', -12) for i in range(3)]
    return ev


XHS = dict(
    aid=AID, cover_t=45.0,
    body='开车经过一段路，轮胎底下冒出一段旋律。不是车里的音响，是路在唱歌。\n\n这期用四道题听世界各地会唱歌的路：韩国、美国、中国，还有日本和匈牙利。原理就一个公式：凸起的间隔等于车速除以频率，开慢了，曲子就又慢又低。原文：贰沐。第三题的两段声音是程序模拟的，其余片段来自原文。',
    tags='声学 科普 物理 会唱歌的路 音乐公路 频率 自驾 公路旅行 冷知识 盲听挑战',
    doubts=['原文说中央 C 的频率是 264 Hz。按现在通用的十二平均律（A4 = 440 Hz），中央 C 是 261.6 Hz；264 Hz 是纯律下的数值。视频沿用原文的 264 Hz 和 6.3 厘米，算出来差别不到 1%。',
            '第一、四题的答案（韩国唱《玛丽有只小羊羔》、千灵山唱《歌唱祖国》）和第二题（Lancaster 跑调）按原文的介绍。韩国那段我用音高跟踪核对过旋律，其余几段请你听一遍确认。'],
    notes=['片段取自原文引用的视频（新闻报道和网友行车记录），韩国和中国两段的台标已裁掉，平台可能限流或静音。'],
)
