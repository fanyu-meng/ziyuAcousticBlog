"""Shared material for the article《432Hz和440Hz，哪个更好听？》: clips cut from the original videos, texts, sources."""
V = '/tmp/claude-0/-home-user/eecd72cb-fc1e-524e-b875-bf836dd07fd2/scratchpad/v432/'
CROP = '640:320:0:36'      # the guitar video is letterboxed; keep the picture and the tuning labels
CLIPS = {
    'tone440': dict(tone=440, d=1.0), 'tone432': dict(tone=432, d=1.0),
    # 原文第一段视频：YouTube 博主的盲听测试。片尾公布：第 1 组 A=440 B=432；第 2 组 A、B 都是 440
    'c1a': dict(src=V + 'v1.mp4', ss=69.00, d=5.5, pair='c1'), 'c1b': dict(src=V + 'v1.mp4', ss=83.76, d=5.5, pair='c1'),
    'c2a': dict(src=V + 'v1.mp4', ss=106.95, d=5.0, pair='c2'), 'c2b': dict(src=V + 'v1.mp4', ss=113.62, d=5.0, pair='c2'),
    # Coldplay《The Scientist》：两版时间轴相差 0.14 秒；画面都用 MV
    'cp440': dict(src=V + 'v2.mp4', ss=16.00, d=7.5, pair='cp', video=dict(src=V + 'v2.mp4', ss=16.0, crop='640:320:0:20')),
    'cp432': dict(src=V + 'v3.mp4', ss=16.14, d=7.5, pair='cp', video=dict(src=V + 'v2.mp4', ss=16.0, crop='640:320:0:20')),
    # Paul Davids：每首歌各弹两遍（432 与 440），按测得的音高分段
    'ww432': dict(src=V + 'v4.mp4', ss=198.95, d=6.0, pair='ww', video=dict(src=V + 'v4.mp4', ss=198.95, crop=CROP)),
    'ww440': dict(src=V + 'v4.mp4', ss=242.99, d=6.0, pair='ww', video=dict(src=V + 'v4.mp4', ss=242.99, crop=CROP)),
    'if440': dict(src=V + 'v4.mp4', ss=286.05, d=6.0, pair='if', video=dict(src=V + 'v4.mp4', ss=287.05, crop=CROP)),
    'if432': dict(src=V + 'v4.mp4', ss=315.26, d=6.0, pair='if', video=dict(src=V + 'v4.mp4', ss=315.26, crop=CROP)),
}
LEGEND = dict(
    results=[('【432Hz】经典歌曲 · 重新调音版', '各种音乐被调到 432Hz'), ('432Hz 版 vs 440Hz 原版', '哪个更好听？'), ('432Hz 音乐合集', '“更自然的调音”')],
    chips=[('“432Hz 更好听”', 'better'), ('“440Hz 对健康不利”', 'health')],
    quoteCn='近期通过对宇宙振动本质的再发现表明，目前使用的标准音高可能会产生对健康的不利影响，或者使人类意识中出现反社会行为……<em>有一种说法，把标准音高从 432Hz 调到 440Hz，是 Nazi 的宣传部长 Joseph Goebbels 发起的。</em>',
    quoteEn='“The recent rediscoveries of the vibratory / oscillatory nature of the universe indicate that this contemporary international concert pitch standard may generate an unhealthy effect or anti-social behavior in the consciousness of human beings … There is a theory that the change from 432 Hz to 440 Hz was dictated by Nazi propaganda minister, Joseph Goebbels”',
    quoteSrc='转引自 Trevor Cox 的博客文章',
)
SOURCES = ['Trevor Cox：Pitch shifting to 432 Hz doesn’t improve music', 'Free Music Archive', 'Global News：440 Hz conspiracy music', 'Paul Davids（吉他对比视频）', 'Zwicker & Fastl (2013). Psychoacoustics: Facts and Models. Springer']
AB = dict(
    yt1=dict(title='盲听测试 · 第 1 组', sub='原视频共四组，这里听两组', blind=True,
             a=dict(clip='c1a', label='440Hz', kind='440'), b=dict(clip='c1b', label='432Hz', kind='432')),
    yt2=dict(title='盲听测试 · 第 2 组', sub='还是 A、B 两个版本', blind=True,
             a=dict(clip='c2a', label='440Hz', kind='440'), b=dict(clip='c2b', label='440Hz', kind='440')),
    cp=dict(title='Coldplay《The Scientist》', sub='432Hz 版为数字变调', video=True,
            a=dict(clip='cp440', label='440Hz 版', kind='440', vtag='440Hz 版'), b=dict(clip='cp432', label='432Hz 版', kind='432', vtag='432Hz 版')),
    ww=dict(title='Pink Floyd《Wish You Were Here》', sub='吉他：Paul Davids · 直接调弦，不做数字处理', video=True,
            a=dict(clip='ww432', label='432Hz', kind='432', vtag='正在弹：左 · 432Hz'), b=dict(clip='ww440', label='440Hz', kind='440', vtag='正在弹：右 · 440Hz')),
    isf=dict(title='Ed Sheeran《I See Fire》', sub='吉他：Paul Davids · 直接调弦，不做数字处理', video=True,
             a=dict(clip='if440', label='440Hz', kind='440', vtag='正在弹：右 · 440Hz'), b=dict(clip='if432', label='432Hz', kind='432', vtag='正在弹：左 · 432Hz')),
)
say = lambda text, **o: ('say', text, o)
clip = lambda name, **o: ('clip', name, o)
wait = lambda d, **o: ('wait', d, o)
